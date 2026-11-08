import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const events = sanctuaryStore.getCalendarEvents();
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, eventDate, isRecurringAnnually, category, createdBy } = body;

    if (!title || !eventDate) {
      return NextResponse.json({ error: 'Title and event date required.' }, { status: 400 });
    }

    const event = sanctuaryStore.addCalendarEvent({
      title,
      description: description || '',
      eventDate,
      isRecurringAnnually: Boolean(isRecurringAnnually),
      category: category || 'milestone',
      createdBy: createdBy === 'lei' ? 'lei' : 'emman',
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Calendar add error:', error);
    return NextResponse.json({ error: 'Failed to add calendar milestone.' }, { status: 500 });
  }
}
