// Web Crypto API based HMAC-SHA256 Token Signing & Verification
// Compatible with Node.js 18+, Next.js Edge Runtime, and standard serverless runtimes.

const SESSION_SECRET =
  process.env.SANCTUARY_SESSION_SECRET ||
  'sanctuary_super_secret_jwt_encryption_key_celestial_wings_2026';

interface TokenPayload {
  sub: string;
  role: 'sanctuary_guest' | 'super_admin' | 'journal_user';
  user?: 'emman' | 'lei';
  exp: number;
  iat: number;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function signToken(
  payload: Omit<TokenPayload, 'iat' | 'exp'>,
  expiresInSeconds: number = 7 * 24 * 60 * 60 // 7 days default
): Promise<string> {
  const key = await getCryptoKey();
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = new TextEncoder();
  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(fullPayload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(dataToSign)
  );
  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const dataToVerify = `${headerB64}.${payloadB64}`;
    const signatureBytes = base64UrlDecode(signatureB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      enc.encode(dataToVerify)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload: TokenPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

// Dedicated Gate Session
export async function createGateSessionToken(): Promise<string> {
  return signToken({ sub: 'sanctuary_entrance', role: 'sanctuary_guest' }, 30 * 24 * 60 * 60);
}

// Dedicated Admin Session (EMMAN ONLY)
export async function createAdminSessionToken(): Promise<string> {
  return signToken(
    { sub: 'emman_super_admin', role: 'super_admin', user: 'emman' },
    24 * 60 * 60 // 24 hours admin session
  );
}

export async function verifyIsAdmin(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload !== null && payload.role === 'super_admin' && payload.user === 'emman';
}

// Dedicated Journal Session for individual privacy
export async function createJournalSessionToken(user: 'emman' | 'lei'): Promise<string> {
  return signToken(
    { sub: `journal_${user}`, role: 'journal_user', user },
    4 * 60 * 60 // 4 hours private session
  );
}

export async function verifyJournalAccess(
  token?: string | null,
  requiredUser?: 'emman' | 'lei'
): Promise<string | null> {
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'journal_user' || !payload.user) return null;
  if (requiredUser && payload.user !== requiredUser) return null;
  return payload.user;
}
