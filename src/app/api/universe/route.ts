import { NextRequest, NextResponse } from 'next/server';
import {
  getSanctuaryDreams,
  addSanctuaryDream,
  toggleSanctuaryDream,
  deleteSanctuaryDream,
} from '@/lib/supabase/db';

export async function GET() {
  const dreams = await getSanctuaryDreams();
  return NextResponse.json({ dreams });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, targetDate, createdBy, starBrightness } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category required.' }, { status: 400 });
    }

    const dream = await addSanctuaryDream({
      title: title.trim(),
      description: description || '',
      category,
      targetDate: targetDate || undefined,
      createdBy: createdBy === 'lei' ? 'lei' : 'emman',
      starX: (Math.random() - 0.5) * 8,
      starY: (Math.random() - 0.5) * 8,
      starZ: (Math.random() - 0.5) * 8,
    });

    return NextResponse.json({ success: true, dream });
  } catch (error) {
    console.error('Universe dream error:', error);
    return NextResponse.json({ error: 'Failed to record constellation dream.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Dream ID required.' }, { status: 400 });

    const dream = await toggleSanctuaryDream(id);
    return NextResponse.json({ success: true, dream });
  } catch {
    return NextResponse.json({ error: 'Failed to toggle dream state.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Dream ID required.' }, { status: 400 });

    await deleteSanctuaryDream(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete dream.' }, { status: 500 });
  }
}
