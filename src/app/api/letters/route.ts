import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user') as 'emman' | 'lei' | null;
  const letters = sanctuaryStore.getLetters(user || undefined);
  return NextResponse.json({ letters });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, recipient, title, content, waxSeal, scheduledFor, isDraft } = body;

    if (!title || !content || !sender || !recipient) {
      return NextResponse.json({ error: 'Missing required letter fields.' }, { status: 400 });
    }

    const letter = sanctuaryStore.sendLetter({
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Letter ID required.' }, { status: 400 });

    const updated = sanctuaryStore.markLetterAsRead(id);
    return NextResponse.json({ success: true, letter: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update letter.' }, { status: 500 });
  }
}
