import { cookies } from "next/headers";
import { db, type User } from "./db";

const SESSION_COOKIE = "fqr_session";

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await getSession();
  if (!sessionId) return null;
  
  const userId = db.getSession(sessionId);
  if (!userId) return null;
  
  const user = db.getUserById(userId);
  if (!user) return null;
  
  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser as User;
}

export async function createUserSession(userId: string): Promise<void> {
  const sessionId = db.createSession(userId);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function deleteUserSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (sessionId) {
    db.deleteSession(sessionId);
  }
  
  cookieStore.delete(SESSION_COOKIE);
}

