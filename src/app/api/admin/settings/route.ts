import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';
import { verifyIsAdmin } from '@/lib/auth/tokens';
import {
  getSanctuarySettings,
  updateSanctuarySettings,
  getSanctuaryMemories,
  getSanctuaryLetters,
  getSanctuaryPlants,
  getSanctuaryDreams,
  getSanctuaryCalendarEvents,
  getSanctuaryAuditLogs,
} from '@/lib/supabase/db';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sanctuary_admin_token')?.value;
  const isAdmin = await verifyIsAdmin(token);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Access reserved strictly for Super Admin Emman.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (action === 'backup') {
    const backup = sanctuaryStore.exportFullBackup();
    return NextResponse.json({ backup });
  }

  if (action === 'rooms') {
    const [memories, letters, plants, dreams, events, settings] = await Promise.all([
      getSanctuaryMemories(),
      getSanctuaryLetters(),
      getSanctuaryPlants(),
      getSanctuaryDreams(),
      getSanctuaryCalendarEvents(),
      getSanctuarySettings(),
    ]);

    return NextResponse.json({
      memories,
      letters,
      plants,
      dreams,
      events,
      settings,
    });
  }

  const settings = await getSanctuarySettings();
  const auditLogs = await getSanctuaryAuditLogs();

  return NextResponse.json({ settings, auditLogs });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('sanctuary_admin_token')?.value;
  const isAdmin = await verifyIsAdmin(token);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await updateSanctuarySettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update sanctuary settings.' }, { status: 500 });
  }
}
