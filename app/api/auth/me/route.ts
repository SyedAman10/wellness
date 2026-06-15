import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/app/lib/users";
import { verifySession, SESSION_COOKIE } from "@/app/lib/session";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const email = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!email) return NextResponse.json({ user: null });

    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
