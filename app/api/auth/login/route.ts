import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const SESSION_COOKIE = "fqr_session";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = db.getUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Neteisingas el. paštas arba slaptažodis" },
      { status: 401 }
    );
  }

  // Create session
  const sessionId = db.createSession(user.id);
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return NextResponse.json({ success: true });
}

