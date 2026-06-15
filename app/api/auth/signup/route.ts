import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/app/lib/users";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/app/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !name.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const normEmail = email.trim().toLowerCase();

    if (await findUserByEmail(normEmail)) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const cleanName = name.trim();
    await createUser({ name: cleanName, email: normEmail, passwordHash });

    const res = NextResponse.json({ user: { name: cleanName, email: normEmail } });
    res.cookies.set(SESSION_COOKIE, signSession(normEmail), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
