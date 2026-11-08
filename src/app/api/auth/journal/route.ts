import { NextRequest, NextResponse } from 'next/server';
import { createJournalSessionToken, verifyJournalAccess } from '@/lib/auth/tokens';
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/auth/rate-limit';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local_journal';
    const body = await req.json();
    const { user, pin, action, oldPin } = body;

    if (!user || (user !== 'emman' && user !== 'lei')) {
      return NextResponse.json({ success: false, error: 'Invalid journal owner.' }, { status: 400 });
    }

    if (!pin || typeof pin !== 'string' || pin.trim().length < 4) {
      return NextResponse.json({ success: false, error: 'PIN must be at least 4 digits.' }, { status: 400 });
    }

    const hasPin = sanctuaryStore.hasJournalPin(user);

    // Initial PIN Setup (User creates their own PIN!)
    if (!hasPin || action === 'setup') {
      sanctuaryStore.setJournalPin(user, pin.trim());
      const journalToken = await createJournalSessionToken(user);

      const response = NextResponse.json({
        success: true,
        user,
        message: `Personal passkey created! Vault unsealed for ${user === 'emman' ? 'Emman' : 'Lei'}.`,
      });

      response.cookies.set(`sanctuary_journal_${user}`, journalToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 4 * 60 * 60,
      });

      return response;
    }

    // Changing existing PIN
    if (action === 'change_pin') {
      const storedPin = sanctuaryStore.getJournalPin(user);
      if (oldPin !== storedPin) {
        return NextResponse.json({ success: false, error: 'Current PIN is incorrect.' }, { status: 401 });
      }
      sanctuaryStore.setJournalPin(user, pin.trim());
      return NextResponse.json({ success: true, message: 'Your passkey has been updated.' });
    }

    // Standard Unlock
    const rateKey = `journal_${user}_${ip}`;
    const rateCheck = checkRateLimit(rateKey, 5, 10 * 60 * 1000, 20 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Locked out due to repeated wrong PINs. Wait ${rateCheck.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const storedPin = sanctuaryStore.getJournalPin(user);
    if (pin.trim() !== storedPin) {
      const failed = recordFailedAttempt(rateKey, 5, 10 * 60 * 1000, 20 * 60 * 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'Personal journal passkey incorrect. Entry denied.',
          remainingAttempts: failed.remainingAttempts,
        },
        { status: 401 }
      );
    }

    clearRateLimit(rateKey);
    const journalToken = await createJournalSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: `Private sanctuary opened for ${user === 'emman' ? 'Emman' : 'Lei'}.`,
    });

    response.cookies.set(`sanctuary_journal_${user}`, journalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 4 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Journal auth error:', error);
    return NextResponse.json({ success: false, error: 'Journal unlocking error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user') as 'emman' | 'lei' | null;
  if (!user || (user !== 'emman' && user !== 'lei')) {
    return NextResponse.json({ unlocked: false, hasPin: false });
  }

  const hasPin = sanctuaryStore.hasJournalPin(user);
  const token = req.cookies.get(`sanctuary_journal_${user}`)?.value;
  const verifiedUser = await verifyJournalAccess(token, user);

  return NextResponse.json({
    hasPin,
    unlocked: verifiedUser === user,
    user: verifiedUser,
  });
}
