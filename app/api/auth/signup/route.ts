import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const SESSION_COOKIE = "fqr_session";

export async function POST(request: NextRequest) {
  const { email, password, fullName } = await request.json();

  // Check if user exists
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    return NextResponse.json(
      { error: "Vartotojas su šiuo el. paštu jau egzistuoja" },
      { status: 400 }
    );
  }

  // Create user
  const user = db.createUser({
    email,
    password, // In production, hash this!
    full_name: fullName,
    gcal_connected: false,
  });

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

