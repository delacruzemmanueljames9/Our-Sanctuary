import { NextRequest, NextResponse } from 'next/server';
import {
  getSanctuaryCalendarEvents,
  addSanctuaryCalendarEvent,
  deleteSanctuaryCalendarEvent,
} from '@/lib/supabase/db';

export async function GET() {
  const events = await getSanctuaryCalendarEvents();
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, eventDate, isRecurringAnnually, category, createdBy } = body;

    if (!title || !eventDate) {
      return NextResponse.json({ error: 'Title and event date are required.' }, { status: 400 });
    }

    const event = await addSanctuaryCalendarEvent({
      title: title.trim(),
      description: description || '',
      eventDate,
      isRecurringAnnually: Boolean(isRecurringAnnually),
      category: category || 'milestone',
      createdBy: createdBy === 'lei' ? 'lei' : 'emman',
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Calendar event error:', error);
    return NextResponse.json({ error: 'Failed to record milestone.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Event ID required.' }, { status: 400 });

    await deleteSanctuaryCalendarEvent(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete milestone.' }, { status: 500 });
  }
}
