import { NextRequest, NextResponse } from 'next/server';
import {
  getSanctuaryLetters,
  sendSanctuaryLetter,
  deleteSanctuaryLetter,
} from '@/lib/supabase/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user') as 'emman' | 'lei' | null;
  const letters = await getSanctuaryLetters(user || undefined);
  return NextResponse.json({ letters });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, recipient, title, content, waxSeal, scheduledFor, isDraft } = body;

    if (!title || !content || !sender || !recipient) {
      return NextResponse.json({ error: 'Missing required letter fields.' }, { status: 400 });
    }

    const letter = await sendSanctuaryLetter({
      sender,
      recipient,
      title,
      content,
      waxSeal: waxSeal || 'golden_heart',
      scheduledFor: scheduledFor || null,
      isDraft: Boolean(isDraft),
      readAt: null,
    });

    return NextResponse.json({ success: true, letter });
  } catch (error) {
    console.error('Send letter error:', error);
    return NextResponse.json({ error: 'Failed to dispatch letter.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Letter ID required.' }, { status: 400 });

    await deleteSanctuaryLetter(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete letter.' }, { status: 500 });
  }
}
