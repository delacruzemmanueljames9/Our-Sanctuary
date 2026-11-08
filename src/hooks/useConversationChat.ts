'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface DirectMsgItem {
  id: string;
  sender: 'emman' | 'lei';
  recipient: 'emman' | 'lei';
  message: string;
  isHuman: boolean;
  createdAt: string;
  _optimistic?: boolean;
  _failed?: boolean;
}

export type ChatConnectionStatus = 'live' | 'connecting' | 'fallback';

const CACHE_KEY = 'our_sanctuary_dm_cache_v2';
const DEFAULT_GREETING: DirectMsgItem = {
  id: 'dm-1',
  sender: 'emman',
  recipient: 'lei',
  message: 'Hi sweetie, whats bothering you now?',
  isHuman: true,
  createdAt: new Date().toISOString(),
};

function readLocalCache(): DirectMsgItem[] {
  if (typeof window === 'undefined') return [DEFAULT_GREETING];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [DEFAULT_GREETING];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed reading localStorage DM cache:', e);
  }
  return [DEFAULT_GREETING];
}

function writeLocalCache(messages: DirectMsgItem[]) {
  if (typeof window === 'undefined') return;
  try {
    // Only cache confirmed non-failed messages
    const confirmed = messages.filter((m) => !m._failed);
    localStorage.setItem(CACHE_KEY, JSON.stringify(confirmed));
  } catch (e) {
    console.warn('Failed writing localStorage DM cache:', e);
  }
}

interface UseConversationChatOptions {
  userRole: 'lei' | 'emman';
}

export function useConversationChat({ userRole }: UseConversationChatOptions) {
  const [messages, setMessages] = useState<DirectMsgItem[]>(readLocalCache);
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ChatConnectionStatus>('connecting');

  // Master message map (keyed by ID) to ensure STRICTLY ADDITIVE updates
  const masterMap = useRef<Map<string, DirectMsgItem>>(new Map());
  const channelRef = useRef<any>(null);

  // Initialize master map from local cache on mount
  useEffect(() => {
    const initial = readLocalCache();
    initial.forEach((m) => masterMap.current.set(m.id, m));
    setMessages(initial);
  }, []);

  // Sync state & localStorage from masterMap
  const commitMessages = useCallback(() => {
    const list = Array.from(masterMap.current.values());
    list.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setMessages(list);
    writeLocalCache(list);
  }, []);

  /**
   * Merge new messages strictly additively.
   * Confirmed messages replace matching optimistic messages.
   * Existing confirmed messages are NEVER removed.
   */
  const mergeIncoming = useCallback((incoming: DirectMsgItem[]) => {
    let changed = false;
    incoming.forEach((msg) => {
      // Check if this incoming message matches an optimistic message from same sender
      if (!masterMap.current.has(msg.id)) {
        // Remove any optimistic placeholder with identical sender & text
        for (const [id, existing] of masterMap.current.entries()) {
          if (
            existing._optimistic &&
            existing.sender === msg.sender &&
            existing.message.trim() === msg.message.trim()
          ) {
            masterMap.current.delete(id);
            break;
          }
        }
        masterMap.current.set(msg.id, msg);
        changed = true;
      }
    });

    if (changed) {
      commitMessages();
    }
  }, [commitMessages]);

  /**
   * Fetch messages from the serverless API.
   * Cloud storage backing ensures all instances return the exact same messages.
   */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        mergeIncoming(data.messages);
      }
    } catch (e) {
      console.warn('fetchMessages error:', e);
    }
  }, [mergeIncoming]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Fast safety polling (1-second interval ensures near-instant fetch)
  useEffect(() => {
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Page visibility & focus refetch
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    };
    const onFocus = () => fetchMessages();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onFocus);
    };
  }, [fetchMessages]);

  // Supabase WebSocket Realtime (Broadcast + Postgres changes)
  useEffect(() => {
    if (!supabase) {
      setConnectionStatus('fallback');
      return;
    }

    const channel = supabase.channel('sanctuary-chat', {
      config: { broadcast: { self: true } },
    });
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'new-message' }, (payload: any) => {
        if (payload?.payload) {
          mergeIncoming([payload.payload]);
        }
      })
      .on('broadcast', { event: 'clear-conversation' }, () => {
        masterMap.current.clear();
        masterMap.current.set(DEFAULT_GREETING.id, DEFAULT_GREETING);
        commitMessages();
      })
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'direct_messages' },
        (payload: any) => {
          if (payload?.new) {
            const m: DirectMsgItem = {
              id: payload.new.id,
              sender: payload.new.sender,
              recipient: payload.new.recipient,
              message: payload.new.message,
              isHuman: payload.new.is_human,
              createdAt: payload.new.created_at,
            };
            mergeIncoming([m]);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('live');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('fallback');
        }
      });

    return () => {
      channelRef.current = null;
      try {
        if (supabase) supabase.removeChannel(channel);
      } catch {}
    };
  }, [mergeIncoming, commitMessages]);

  /**
   * Send message with instant optimistic display & broadcast
   */
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setSendError(null);
    setIsSending(true);

    const recipient = userRole === 'lei' ? 'emman' : 'lei';
    const optimisticId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimisticMsg: DirectMsgItem = {
      id: optimisticId,
      sender: userRole,
      recipient,
      message: trimmed,
      isHuman: true,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    // Instant local presentation
    masterMap.current.set(optimisticId, optimisticMsg);
    commitMessages();

    // Instant broadcast over open WebSocket (sub-100ms to peer)
    if (channelRef.current) {
      try {
        channelRef.current.send({
          type: 'broadcast',
          event: 'new-message',
          payload: optimisticMsg,
        });
      } catch (e) {
        console.warn('Client broadcast send failed:', e);
      }
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userRole,
          recipient,
          message: trimmed,
          isHuman: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      if (data.message) {
        const confirmed: DirectMsgItem = data.message;
        masterMap.current.delete(optimisticId);
        masterMap.current.set(confirmed.id, confirmed);
        commitMessages();

        // Broadcast confirmed message to peer
        if (channelRef.current) {
          try {
            channelRef.current.send({
              type: 'broadcast',
              event: 'new-message',
              payload: confirmed,
            });
          } catch {}
        }
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      // Mark as failed so user can tap to retry
      const failed = masterMap.current.get(optimisticId);
      if (failed) {
        failed._optimistic = false;
        failed._failed = true;
        commitMessages();
      }
      setSendError('Message failed to send. Tap message to retry.');
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Retry sending a failed message
   */
  const retryFailed = (failedMsg: DirectMsgItem) => {
    masterMap.current.delete(failedMsg.id);
    commitMessages();
    sendMessage(failedMsg.message);
  };

  /**
   * Delete conversation history
   */
  const clearConversation = async () => {
    if (!confirm('Delete conversation history and start fresh?')) return false;

    setIsClearing(true);
    try {
      const res = await fetch('/api/messages', { method: 'DELETE' });
      if (res.ok) {
        masterMap.current.clear();
        masterMap.current.set(DEFAULT_GREETING.id, DEFAULT_GREETING);
        commitMessages();

        if (channelRef.current) {
          try {
            channelRef.current.send({
              type: 'broadcast',
              event: 'clear-conversation',
              payload: {},
            });
          } catch {}
        }
        return true;
      }
    } catch (e) {
      console.error('clearConversation error:', e);
    } finally {
      setIsClearing(false);
    }
    return false;
  };

  return {
    messages,
    isSending,
    isClearing,
    sendError,
    connectionStatus,
    sendMessage,
    retryFailed,
    clearConversation,
    fetchMessages,
  };
}
