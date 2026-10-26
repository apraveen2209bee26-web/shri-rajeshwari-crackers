import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'sri-rajeshwari-super-secure-admin-secret-2026';

/**
 * Creates a cryptographically signed HMAC token for the authenticated admin
 */
export function createAdminToken(username = 'admin') {
  const payload = JSON.stringify({
    user: username,
    created: Date.now()
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

/**
 * Verifies whether a token string is a valid, un-tampered, and non-expired admin token.
 * Also supports legacy session token for seamless backwards compatibility.
 */
export function verifyAdminToken(tokenString) {
  if (!tokenString || typeof tokenString !== 'string') return false;

  // Backwards-compatible check so currently logged-in users aren't abruptly logged out
  if (tokenString === 'authenticated_sachin_admin_session_active') {
    return true;
  }

  const parts = tokenString.split('.');
  if (parts.length !== 2) return false;

  const [b64Payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(b64Payload).digest('base64url');

  if (signature.length !== expectedSignature.length) return false;
  const isMatch = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!isMatch) return false;

  try {
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    // Expire after 14 days
    if (Date.now() - payload.created > 14 * 24 * 60 * 60 * 1000) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates admin authentication from Next.js cookies or Authorization Bearer header.
 * Returns true if authenticated, false otherwise.
 */
export function verifyAdminAuth(request) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('admin_auth_token');
    if (tokenCookie && verifyAdminToken(tokenCookie.value)) {
      return true;
    }
  } catch (e) {
    // In contexts where cookies() might not be available
  }

  if (request && typeof request.headers?.get === 'function') {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (verifyAdminToken(token)) return true;
    }
  }

  return false;
}
