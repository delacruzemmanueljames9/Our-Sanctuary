import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';
import { verifyJournalAccess } from '@/lib/auth/tokens';
import { getSharedJournalEntries, addSharedJournalEntry } from '@/lib/supabase/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  // Shared Journal access (both Emman & Lei can read)
  if (type === 'shared') {
    const entries = await getSharedJournalEntries();
    return NextResponse.json({ entries });
  }

  // Private Journal access (Strict Author Isolation)
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
    const { type, user, title, content, moodTag } = body;

    // Shared Journal post
    if (type === 'shared') {
      const author = user === 'lei' ? 'lei' : 'emman';
      if (!title || !content) {
        return NextResponse.json({ error: 'Title and content required.' }, { status: 400 });
      }
      const entry = await addSharedJournalEntry({
        author,
        title: title.trim(),
        content: content.trim(),
        moodTag: moodTag || 'Together',
      });
      return NextResponse.json({ success: true, entry });
    }

    // Private Journal post (Strict Author Isolation)
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
      title: title.trim(),
      content: content.trim(),
      moodTag: moodTag || 'Thoughtful',
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Journal entry error:', error);
    return NextResponse.json({ error: 'Failed to save reflection.' }, { status: 500 });
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
