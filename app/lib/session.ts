import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
export const SESSION_COOKIE = "ayavine_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function signSession(email: string): string {
  const value = Buffer.from(email).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  return `${value}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [value, sig] = token.split(".");
  if (!value || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return Buffer.from(value, "base64url").toString();
}
