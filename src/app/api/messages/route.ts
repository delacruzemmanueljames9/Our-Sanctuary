import { NextRequest, NextResponse } from 'next/server';
import { getDirectMessages, sendDirectMessage, clearDirectMessages } from '@/lib/supabase/db';

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

    return NextResponse.json({ success: true, message: created });
  } catch (error) {
    console.error('Direct message error:', error);
    return NextResponse.json({ error: 'Failed to dispatch message.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearDirectMessages();
    return NextResponse.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (error) {
    console.error('Clear direct messages error:', error);
    return NextResponse.json({ error: 'Failed to clear conversation.' }, { status: 500 });
  }
}
