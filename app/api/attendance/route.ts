import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const SESSION_COOKIE = "fqr_session";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!sessionId) return null;
  
  const userId = db.getSession(sessionId);
  if (!userId) return null;
  
  return db.getUserById(userId);
}

export async function POST(request: NextRequest) {
  const { roomId } = await request.json();
  
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Check for existing attendance today
  const existingAttendance = db
    .getAttendanceByUserAndRoom(user.id, roomId, todayStart)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  let action: "enter" | "exit" = "enter";

  if (existingAttendance.length > 0) {
    const lastRecord = existingAttendance[0];
    const lastTime = new Date(lastRecord.timestamp);
    const minutesDiff = (now.getTime() - lastTime.getTime()) / (1000 * 60);

    // If 60+ minutes since last tap, mark as exit
    if (minutesDiff >= 60) {
      action = "exit";
    } else {
      // Too soon, just acknowledge
      return NextResponse.json({
        success: true,
        message: "Jau užregistruota neseniai",
        action: lastRecord.action,
        timestamp: lastRecord.timestamp,
      });
    }
  }

  const record = db.createAttendance({
    user_id: user.id,
    room_id: roomId,
    action,
    timestamp: now.toISOString(),
  });

  return NextResponse.json({
    success: true,
    action,
    timestamp: now.toISOString(),
    data: record,
  });
}

