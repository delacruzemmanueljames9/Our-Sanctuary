'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type RealtimeTable =
  | 'letters'
  | 'garden_plants'
  | 'memories'
  | 'emotional_checkins'
  | 'universe_dreams'
  | 'sanctuary_settings'
  | 'direct_messages'
  | 'shared_journals'
  | 'calendar_events';

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected' | 'disabled';

interface UseSanctuaryRealtimeOptions {
  table: RealtimeTable;
  onInsert?: (newRow: any) => void;
  onUpdate?: (updatedRow: any) => void;
  onDelete?: (deletedRow: any) => void;
  onChange?: () => void;
}

/**
 * Live Supabase Realtime listener hook.
 * Subscribes to PostgreSQL database changes in real-time across all authorized sessions.
 * Returns { status } so the UI can show a live connection indicator.
 */
export function useSanctuaryRealtime({
  table,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: UseSanctuaryRealtimeOptions): { status: RealtimeStatus } {
  const onChangeRef = useRef(onChange);
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);
  const [status, setStatus] = useState<RealtimeStatus>(supabase ? 'connecting' : 'disabled');

  onChangeRef.current = onChange;
  onInsertRef.current = onInsert;
  onUpdateRef.current = onUpdate;
  onDeleteRef.current = onDelete;

  useEffect(() => {
    if (!supabase) {
      setStatus('disabled');
      return;
    }

    setStatus('connecting');
    const channelName = `realtime:${table}:${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table },
        (payload: any) => {
          if (payload.eventType === 'INSERT') onInsertRef.current?.(payload.new);
          else if (payload.eventType === 'UPDATE') onUpdateRef.current?.(payload.new);
          else if (payload.eventType === 'DELETE') onDeleteRef.current?.(payload.old);
          onChangeRef.current?.();
        }
      )
      .subscribe((statusStr: string) => {
        if (statusStr === 'SUBSCRIBED') setStatus('connected');
        else if (
          statusStr === 'CHANNEL_ERROR' ||
          statusStr === 'TIMED_OUT' ||
          statusStr === 'CLOSED'
        ) setStatus('disconnected');
      });

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [table]);

  return { status };
}
