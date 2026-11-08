import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const checkins = sanctuaryStore.getEmotionalCheckins();
  return NextResponse.json({ checkins });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, mood, supportPreference, reflection, isShared } = body;

    if (!author || !mood) {
      return NextResponse.json({ error: 'Author and mood required.' }, { status: 400 });
    }

    const checkin = sanctuaryStore.addEmotionalCheckin({
      author: author === 'lei' ? 'lei' : 'emman',
      mood,
      supportPreference: supportPreference || 'listen',
      reflection: reflection || '',
      isShared: isShared !== false,
    });

    return NextResponse.json({ success: true, checkin });
  } catch (error) {
    console.error('Emotional checkin error:', error);
    return NextResponse.json({ error: 'Failed to record emotional reflection.' }, { status: 500 });
  }
}
