import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const dreams = sanctuaryStore.getUniverseDreams();
  return NextResponse.json({ dreams });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, targetDate, createdBy, starX, starY, starZ } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title required.' }, { status: 400 });
    }

    const dream = sanctuaryStore.addUniverseDream({
      title,
      description: description || '',
      category: category || 'bucket_list',
      targetDate,
      starX: typeof starX === 'number' ? starX : (Math.random() - 0.5) * 80,
      starY: typeof starY === 'number' ? starY : Math.random() * 50 + 10,
      starZ: typeof starZ === 'number' ? starZ : -(Math.random() * 50 + 20),
      createdBy: createdBy === 'lei' ? 'lei' : 'emman',
    });

    return NextResponse.json({ success: true, dream });
  } catch (error) {
    console.error('Universe dream error:', error);
    return NextResponse.json({ error: 'Failed to place star in the universe.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Dream ID required.' }, { status: 400 });

    const dream = sanctuaryStore.toggleDreamCompleted(id);
    return NextResponse.json({ success: true, dream });
  } catch {
    return NextResponse.json({ error: 'Failed to update star constellation.' }, { status: 500 });
  }
}
