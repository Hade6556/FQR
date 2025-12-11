"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateFomoMessage, type UserStats, type GroupStats } from "@/lib/fomo";
import { getFreeHours } from "./calendar";
import { getTodayAttendance } from "./attendance";

export async function getUserStats(): Promise<UserStats | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const calendarData = await getFreeHours();
  const attendanceData = await getTodayAttendance();

  return {
    freeHours: calendarData.freeHours,
    studiedHours: calendarData.studiedHours,
    tasksToday: calendarData.todayTasks.length,
    attendanceEnter: attendanceData.enter,
    attendanceExit: attendanceData.exit,
  };
}

export async function getGroupStats(): Promise<GroupStats> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Get all users count
  const users = db.getUsers();
  const totalUsers = users.length || 1;

  // Get total attendance for today
  const allAttendance = db.getAttendance();
  const todayAttendance = allAttendance.filter(
    (a) => new Date(a.timestamp) >= todayStart
  );
  const enterEvents = todayAttendance.filter((a) => a.action === "enter").length;

  // Average attendance (enter events per user today)
  const avgAttendance = Math.round((enterEvents / totalUsers) * 10) / 10;

  // Mock average study hours (in production, this would come from calendar data)
  const avgStudyHours = Math.round((4 + Math.random() * 2) * 10) / 10;

  return {
    avgStudyHours,
    avgAttendance,
  };
}

export async function generateFomo(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const userStats = await getUserStats();
  const groupStats = await getGroupStats();

  if (!userStats) {
    return { success: false, error: "Could not get user stats" };
  }

  const message = await generateFomoMessage(userStats, groupStats);

  // Store the FOMO message
  db.createFomoLog({
    user_id: user.id,
    message,
    created_at: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true, message };
}

export async function getFomoFeed(
  limit = 5
): Promise<{ id: string; message: string; created_at: string }[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  return db.getFomoLogsByUserId(user.id, limit);
}
