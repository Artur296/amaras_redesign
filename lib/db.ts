import { neon } from "@neondatabase/serverless";

// Lazy so builds without DATABASE_URL don't crash at import time.
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
