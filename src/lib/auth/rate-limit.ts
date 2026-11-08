// In-memory sliding window rate limiter for Gate and Admin authentication

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  success: boolean;
  remainingAttempts: number;
  lockedUntilMs?: number;
  retryAfterSeconds?: number;
}

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 10 * 60 * 1000, // 10 minutes
  lockoutMs: number = 15 * 60 * 1000 // 15 minutes lockout
): RateLimitResult {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record) {
    return { success: true, remainingAttempts: maxAttempts };
  }

  // Check if locked out
  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remainingAttempts: 0,
      lockedUntilMs: record.lockedUntil,
      retryAfterSeconds,
    };
  }

  // Check if window has expired
  if (now - record.firstAttemptAt > windowMs) {
    memoryStore.delete(identifier);
    return { success: true, remainingAttempts: maxAttempts };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return {
    success: remaining > 0,
    remainingAttempts: remaining,
  };
}

export function recordFailedAttempt(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 10 * 60 * 1000,
  lockoutMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  let record = memoryStore.get(identifier);

  if (!record || now - record.firstAttemptAt > windowMs) {
    record = {
      attempts: 1,
      firstAttemptAt: now,
      lockedUntil: 0,
    };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= maxAttempts) {
    record.lockedUntil = now + lockoutMs;
  }

  memoryStore.set(identifier, record);

  const isLocked = record.lockedUntil > now;
  return {
    success: !isLocked,
    remainingAttempts: Math.max(0, maxAttempts - record.attempts),
    lockedUntilMs: isLocked ? record.lockedUntil : undefined,
    retryAfterSeconds: isLocked ? Math.ceil((record.lockedUntil - now) / 1000) : undefined,
  };
}

export function clearRateLimit(identifier: string): void {
  memoryStore.delete(identifier);
}
