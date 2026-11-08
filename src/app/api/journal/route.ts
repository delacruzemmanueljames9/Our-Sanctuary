import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';
import { verifyJournalAccess } from '@/lib/auth/tokens';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user') as 'emman' | 'lei' | null;

  if (!user || (user !== 'emman' && user !== 'lei')) {
    return NextResponse.json({ error: 'Author required.' }, { status: 400 });
  }

  // Verify personal journal token
  const token = req.cookies.get(`sanctuary_journal_${user}`)?.value;
  const verifiedUser = await verifyJournalAccess(token, user);

  if (verifiedUser !== user) {
    return NextResponse.json(
      { error: 'Private journal locked. Personal passkey authentication required.' },
      { status: 401 }
    );
  }

  const entries = sanctuaryStore.getPrivateJournal(user);
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, title, content, moodTag } = body;

    if (!user || (user !== 'emman' && user !== 'lei')) {
      return NextResponse.json({ error: 'Invalid journal user.' }, { status: 400 });
    }

    const token = req.cookies.get(`sanctuary_journal_${user}`)?.value;
    const verifiedUser = await verifyJournalAccess(token, user);

    if (verifiedUser !== user) {
      return NextResponse.json({ error: 'Unauthorized to write to this private journal.' }, { status: 401 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required.' }, { status: 400 });
    }

    const entry = sanctuaryStore.addPrivateJournalEntry({
      author: user,
      title,
      content,
      moodTag: moodTag || 'Thoughtful',
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Journal entry error:', error);
    return NextResponse.json({ error: 'Failed to save private reflection.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const user = url.searchParams.get('user') as 'emman' | 'lei' | null;

  if (!id || !user) {
    return NextResponse.json({ error: 'ID and user required.' }, { status: 400 });
  }

  const token = req.cookies.get(`sanctuary_journal_${user}`)?.value;
  const verifiedUser = await verifyJournalAccess(token, user);

  if (verifiedUser !== user) {
    return NextResponse.json({ error: 'Unauthorized to delete this entry.' }, { status: 401 });
  }

  sanctuaryStore.deletePrivateJournalEntry(id, user);
  return NextResponse.json({ success: true });
}
