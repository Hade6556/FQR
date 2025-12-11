"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getMockCalendarData, type CalendarStats } from "@/lib/calendar";

export async function importCalendarMock(): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Update user to mark calendar as connected
  db.updateUser(user.id, { gcal_connected: true });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getFreeHours(): Promise<CalendarStats> {
  const user = await getCurrentUser();

  if (!user) {
    return { todayTasks: [], freeHours: 0, studiedHours: 0 };
  }

  // Check if user has connected calendar
  const userData = db.getUserById(user.id);

  if (!userData?.gcal_connected) {
    // Return default values if calendar not connected
    return {
      todayTasks: ["Kalendorius neprijungtas"],
      freeHours: 8,
      studiedHours: 0,
    };
  }

  // Return mock calendar data
  return getMockCalendarData();
}

export async function disconnectCalendar(): Promise<{ success: boolean }> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  db.updateUser(user.id, { gcal_connected: false });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true };
}
