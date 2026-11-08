import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/auth/rate-limit';
import { createGateSessionToken, verifyToken } from '@/lib/auth/tokens';

const CORRECT_PIN = process.env.SANCTUARY_GATE_PIN || '021524';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local_visitor';
    const rateCheck = checkRateLimit(`gate_${ip}`, 6, 10 * 60 * 1000, 15 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `The castle gates are sealed for protection. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string' || pin.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'A six-digit sanctuary PIN is required.' },
        { status: 400 }
      );
    }

    if (pin.trim() !== CORRECT_PIN) {
      const failed = recordFailedAttempt(`gate_${ip}`, 6, 10 * 60 * 1000, 15 * 60 * 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'The ancient runes softly dim. The gate remains locked.',
          remainingAttempts: failed.remainingAttempts,
          locked: !failed.success,
        },
        { status: 401 }
      );
    }

    // Success! Clear failure count and issue secure session cookie
    clearRateLimit(`gate_${ip}`);
    const token = await createGateSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'The Angel Heart Knight lowers his blade and welcomes you home.',
    });

    response.cookies.set('sanctuary_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Gate auth error:', error);
    return NextResponse.json(
      { success: false, error: 'A mystical disruption occurred at the gate.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sanctuary_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'sanctuary_guest') {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true });
}
