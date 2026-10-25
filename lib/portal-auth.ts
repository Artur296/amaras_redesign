import crypto from "crypto";
import { cookies } from "next/headers";

export const PORTAL_COOKIE = "amaras_portal_session";

// Secret for signing portal session tokens
const PORTAL_SESSION_SECRET =
  process.env.PORTAL_SESSION_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  "amaras-portal-secure-salt-2026";

// Static admin credentials for the portal
export const PORTAL_ADMIN_USERNAME = "admin";
export const PORTAL_ADMIN_PASSWORD = "amaras_big_secret2026$";

export type PortalSessionUser = {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "employee";
};

/**
 * Hash password using scrypt with random salt
 */
export function hashPortalPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

/**
 * Verify password against stored hash (salt:hash)
 */
export function verifyPortalPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, hash] = storedHash.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Sign session payload: base64(JSON).signature
 */
export function createPortalSessionToken(user: PortalSessionUser): string {
  const payload = Buffer.from(JSON.stringify({ ...user, iat: Date.now() })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", PORTAL_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Verify session token and return user if valid
 */
export function verifyPortalSessionToken(token: string | undefined | null): PortalSessionUser | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", PORTAL_SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.id || !data.username || !data.role) return null;
    return {
      id: data.id,
      username: data.username,
      fullName: data.fullName || data.username,
      role: data.role,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieve current portal session user on the server
 */
export async function getPortalSession(): Promise<PortalSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_COOKIE)?.value;
  return verifyPortalSessionToken(token);
}

export const portalCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};
