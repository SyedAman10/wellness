import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "subscribers.json");

function readSubscribers(): string[] {
  if (!existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const subscribers = readSubscribers();

  if (subscribers.includes(email)) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
  }

  subscribers.push(email);
  writeFileSync(DB_PATH, JSON.stringify(subscribers, null, 2));

  return NextResponse.json({ success: true });
}
