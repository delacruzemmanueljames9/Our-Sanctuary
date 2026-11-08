'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Trash2, WifiOff, Loader2 } from 'lucide-react';
import { RoomShell } from '@/components/sanctuary/RoomShell';
import { useSanctuaryRealtime, RealtimeStatus } from '@/hooks/useSanctuaryRealtime';

interface DirectMsgItem {
  id: string;
  sender: 'emman' | 'lei';
  recipient: 'emman' | 'lei';
  message: string;
  isHuman: boolean;
  createdAt: string;
  _optimistic?: boolean;
  _failed?: boolean;
}

const QUICK_NOTES = [
  'Thinking of you! 💖',
  'I miss you so much ✨',
  'Good morning my love ☀️',
  'Good night, sweet dreams 🌙',
  'Love you always 🌸',
];

function StatusDot({ status }: { status: RealtimeStatus }) {
  if (status === 'connected') {
    return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    );
  }
  if (status === 'connecting') {
    return (
      <span className="flex items-center gap-1 text-[10px] text-yellow-400">
        <Loader2 className="w-2.5 h-2.5 animate-spin" />
        Connecting…
      </span>
    );
  }
  if (status === 'disconnected') {
    return (
      <span className="flex items-center gap-1 text-[10px] text-slate-500">
        <WifiOff className="w-2.5 h-2.5" />
        Offline
      </span>
    );
  }
  return null;
}

export default function ConversationRoomPage() {
  const [messages, setMessages] = useState<DirectMsgItem[]>([]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const knownIds = useRef<Set<string>>(new Set());

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.messages) {
        setMessages((prev) => {
          const realMap = new Map<string, DirectMsgItem>();
          (data.messages as DirectMsgItem[]).forEach((m) => realMap.set(m.id, m));
          // Keep pending optimistic messages not yet confirmed
          const pending = prev.filter((m) => m._optimistic && !realMap.has(m.id));
          const merged = [...Array.from(realMap.values()), ...pending];
          merged.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          data.messages.forEach((m: DirectMsgItem) => knownIds.current.add(m.id));
          return merged;
        });
      }
    } catch (e) {
      console.error('fetchMessages error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll input into view when virtual keyboard opens on mobile
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleFocus = () => {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        scrollToBottom();
      }, 300);
    };
    el.addEventListener('focus', handleFocus);
    return () => el.removeEventListener('focus', handleFocus);
  }, [scrollToBottom]);

  // Supabase Realtime subscription
  const { status: realtimeStatus } = useSanctuaryRealtime({
    table: 'direct_messages',
    onInsert: (newRow) => {
      const msg: DirectMsgItem = {
        id: newRow.id,
        sender: newRow.sender,
        recipient: newRow.recipient,
        message: newRow.message,
        isHuman: newRow.is_human,
        createdAt: newRow.created_at,
      };
      if (!knownIds.current.has(msg.id)) {
        knownIds.current.add(msg.id);
        setMessages((prev) => {
          // Replace optimistic message with confirmed one if same content
          const withoutOptimistic = prev.filter(
            (m) => !(m._optimistic && m.sender === msg.sender && m.message === msg.message)
          );
          return [...withoutOptimistic, msg];
        });
      }
    },
    onChange: () => {
      fetchMessages();
    },
  });

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isSending) return;

    setSendError(null);
    setIsSending(true);

    // Optimistic update — message appears instantly
    const optimisticId = `opt-${Date.now()}`;
    const optimisticMsg: DirectMsgItem = {
      id: optimisticId,
      sender: 'lei',
      recipient: 'emman',
      message: text,
      isHuman: true,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'lei', recipient: 'emman', message: text, isHuman: true }),
      });

      if (!res.ok) throw new Error('Send failed');

      const data = await res.json();
      if (data.message) {
        const confirmed: DirectMsgItem = data.message;
        knownIds.current.add(confirmed.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? { ...confirmed } : m))
        );
      }
    } catch {
      // Mark as failed — user can tap to retry
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId ? { ...m, _optimistic: false, _failed: true } : m
        )
      );
      setSendError('Message failed to send. Tap failed message to retry.');
    } finally {
      setIsSending(false);
    }
  };

  const retryFailed = (msg: DirectMsgItem) => {
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    sendMessage(msg.message);
  };

  const handleClearConversation = async () => {
    if (!confirm('Delete conversation history and start fresh with Emman?')) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/messages', { method: 'DELETE' });
      if (res.ok) {
        knownIds.current.clear();
        await fetchMessages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsClearing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <RoomShell>
      {/* Keyboard-safe full height: dvh shrinks when keyboard opens */}
      <div
        className="flex flex-col px-3 py-4 md:px-12 md:py-8 max-w-4xl mx-auto"
        style={{ height: 'calc(100dvh - 56px)', minHeight: 'calc(100svh - 56px)' }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-rose-900/20 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
                Room 04 · Conversation
              </span>
              <StatusDot status={realtimeStatus} />
            </div>
            <h1 className="text-xl md:text-3xl font-serif text-white tracking-wide">
              Talk to Emman
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-lg">
              Direct real-time messages between you and Emman.
            </p>
          </div>

          <button
            type="button"
            disabled={isClearing}
            onClick={handleClearConversation}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 text-xs font-serif transition-colors cursor-pointer"
            title="Delete conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Convo</span>
          </button>
        </div>

        {/* Chat Card */}
        <div className="flex-1 flex flex-col min-h-0 rounded-2xl sm:rounded-3xl celestial-panel border border-rose-500/30 shadow-2xl overflow-hidden bg-slate-950/70">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-[#070913]/60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-sanctuary-gold animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-10 h-10 text-rose-400/50 mb-3 animate-pulse" />
                <p className="font-serif text-sm text-slate-300">No messages yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Leave a note for Emman anytime. He will see it in his Admin room and reply directly.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isEmman = msg.sender === 'emman';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: msg._failed ? 0.6 : 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`flex flex-col ${isEmman ? 'items-start' : 'items-end'}`}
                      onClick={msg._failed ? () => retryFailed(msg) : undefined}
                      style={{ cursor: msg._failed ? 'pointer' : 'default' }}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] font-serif">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            isEmman
                              ? 'bg-amber-950/80 border border-sanctuary-gold/50 text-sanctuary-gold'
                              : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                          }`}
                        >
                          {isEmman ? 'Emman' : 'Lei (You)'}
                        </span>
                        <span className="text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg._optimistic && (
                          <span className="text-slate-600 italic">sending…</span>
                        )}
                        {msg._failed && (
                          <span className="text-rose-500 italic">⚠ Tap to retry</span>
                        )}
                      </div>
                      <div
                        className={`max-w-[88%] sm:max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isEmman
                            ? 'bg-amber-950/40 text-amber-100 border border-sanctuary-gold/40 rounded-tl-none shadow-sm'
                            : msg._failed
                            ? 'bg-rose-950/60 text-rose-200 border border-rose-500/60 rounded-tr-none opacity-70'
                            : msg._optimistic
                            ? 'bg-rose-950/30 text-rose-100 border border-rose-500/20 rounded-tr-none'
                            : 'bg-rose-950/50 text-rose-100 border border-rose-500/40 rounded-tr-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Notes */}
          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/60 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {QUICK_NOTES.map((note, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSending}
                onClick={() => sendMessage(note)}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-rose-400 hover:text-rose-200 text-slate-400 text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 touch-manipulation"
              >
                {note}
              </button>
            ))}
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {sendError && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-2 bg-rose-950/60 border-t border-rose-700/40 text-rose-300 text-xs text-center"
              >
                {sendError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input — sticky above virtual keyboard */}
          <form
            onSubmit={handleSubmit}
            className="chat-input-safe p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/95 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setSendError(null); }}
              placeholder="Type a message to Emman…"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-sanctuary-gold text-sm text-white placeholder-slate-500 outline-none transition-colors touch-manipulation"
              autoComplete="off"
              autoCorrect="on"
              spellCheck
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-sanctuary-gold to-yellow-500 text-slate-950 font-serif font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer shadow-sm flex items-center gap-2 touch-manipulation shrink-0"
              title="Send"
            >
              {isSending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </form>
        </div>
      </div>
    </RoomShell>
  );
}
