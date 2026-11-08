import { NextRequest, NextResponse } from 'next/server';
import { getDirectMessages, sendDirectMessage, clearDirectMessages } from '@/lib/supabase/db';
import { getServiceSupabase } from '@/lib/supabase/server';

async function broadcastEvent(event: string, payload: any) {
  const supabase = getServiceSupabase();
  if (!supabase) return;
  try {
    const channel = supabase.channel(`sanctuary-chat-srv-${Date.now()}`);
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        try { supabase.removeChannel(channel); } catch {}
        resolve();
      }, 1000);

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.send({ type: 'broadcast', event, payload });
          } catch {}
          clearTimeout(timeout);
          try { supabase.removeChannel(channel); } catch {}
          resolve();
        }
      });
    });
  } catch (e) {
    console.warn('Server broadcast failed:', e);
  }
}

export async function GET() {
  const messages = await getDirectMessages();
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, recipient, message, isHuman } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message content required.' }, { status: 400 });
    }

    const created = await sendDirectMessage({
      sender: sender === 'lei' ? 'lei' : 'emman',
      recipient: recipient === 'lei' ? 'lei' : 'emman',
      message: message.trim(),
      isHuman: typeof isHuman === 'boolean' ? isHuman : true,
    });

    // Broadcast to WebSocket subscribers asynchronously
    broadcastEvent('new-message', created).catch(() => {});

    return NextResponse.json({ success: true, message: created });
  } catch (error) {
    console.error('Direct message error:', error);
    return NextResponse.json({ error: 'Failed to dispatch message.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearDirectMessages();
    broadcastEvent('clear-conversation', {}).catch(() => {});
    return NextResponse.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (error) {
    console.error('Clear direct messages error:', error);
    return NextResponse.json({ error: 'Failed to clear conversation.' }, { status: 500 });
  }
}
