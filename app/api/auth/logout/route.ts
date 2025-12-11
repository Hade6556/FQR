import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const SESSION_COOKIE = "fqr_session";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    db.deleteSession(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);

  return NextResponse.json({ success: true });
}

