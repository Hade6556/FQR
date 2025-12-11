"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function logAttendance(roomId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
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
      return {
        success: true,
        message: "Jau užregistruota neseniai",
        action: lastRecord.action,
        timestamp: lastRecord.timestamp,
      };
    }
  }

  const record = db.createAttendance({
    user_id: user.id,
    room_id: roomId,
    action,
    timestamp: now.toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return {
    success: true,
    action,
    timestamp: now.toISOString(),
    data: record,
  };
}

export async function getLatestAttendance() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  return db.getAttendanceByUserId(user.id).slice(0, 10);
}

export async function getTodayAttendance() {
  const user = await getCurrentUser();

  if (!user) {
    return { enter: 0, exit: 0 };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayAttendance = db
    .getAttendanceByUserId(user.id)
    .filter((a) => new Date(a.timestamp) >= todayStart);

  const enterCount = todayAttendance.filter((a) => a.action === "enter").length;
  const exitCount = todayAttendance.filter((a) => a.action === "exit").length;

  return { enter: enterCount, exit: exitCount };
}
