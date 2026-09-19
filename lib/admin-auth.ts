import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "amaras_admin";
const SESSION_DAYS = 30;

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

// The session-signing secret is derived from whichever server-only secret is
// configured. Deriving it from the password by default is deliberate:
// changing the password signs every existing session out.
function secret(): Buffer {
  const material =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD_HASH ||
    process.env.ADMIN_PASSWORD ||
    process.env.GITHUB_TOKEN ||
    "dev";
  return createHmac("sha256", "amaras-admin-session-v1").update(material).digest();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Checks a login against the configured admin password.
 *
 * ADMIN_PASSWORD_HASH (salt:hash, from `npm run hash-password`) is preferred.
 * ADMIN_PASSWORD holds the password in plain text instead — less good, but it
 * means a forgotten password is fixed by editing one Vercel variable from a
 * phone, with no laptop and no database.
 */
export function verifyAdminPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (stored) return verifyPassword(password, stored);
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return constantTimeEquals(password, plain);
  return false;
}

export function hasAdminPassword(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSession(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.u !== "string" || Date.now() > data.exp) return null;
    return data.u;
  } catch {
    return null;
  }
}

// For server components and route handlers.
export async function getAdminUser(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
