import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/auth/rate-limit';
import { createAdminSessionToken, verifyIsAdmin } from '@/lib/auth/tokens';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

const ADMIN_SECRET = process.env.EMMAN_ADMIN_SECRET || 'emman_celestial_admin_2026';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local_admin';
    const rateCheck = checkRateLimit(`admin_${ip}`, 4, 15 * 60 * 1000, 30 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Administrator verification locked due to failed attempts. Retry in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { secret } = body;

    if (!secret || typeof secret !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Administrator passkey is required.' },
        { status: 400 }
      );
    }

    if (secret.trim() !== ADMIN_SECRET) {
      const failed = recordFailedAttempt(`admin_${ip}`, 4, 15 * 60 * 1000, 30 * 60 * 1000);
      sanctuaryStore.logAction('FAILED_ADMIN_LOGIN', 'Security', { ip });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid administrator credentials. Access strictly reserved for Emman.',
          remainingAttempts: failed.remainingAttempts,
        },
        { status: 403 }
      );
    }

    // Success! Issue admin cookie
    clearRateLimit(`admin_${ip}`);
    const adminToken = await createAdminSessionToken();
    sanctuaryStore.logAction('SUCCESSFUL_ADMIN_LOGIN', 'Security', { ip });

    const response = NextResponse.json({
      success: true,
      message: 'Welcome back, Master Architect Emman. Control Center unlocked.',
    });

    response.cookies.set('sanctuary_admin_token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal verification fault.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sanctuary_admin_token')?.value;
  const isAdmin = await verifyIsAdmin(token);
  return NextResponse.json({ isAdmin });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Admin session terminated.' });
  response.cookies.delete('sanctuary_admin_token');
  return response;
}
