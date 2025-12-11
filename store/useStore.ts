"use client";

import { create } from "zustand";
import type { User, Attendance, FomoLog } from "@/lib/db";

// Re-export types for convenience
export type { User, Attendance, FomoLog };

interface AppState {
  user: Omit<User, "password"> | null;
  attendance: Attendance[];
  fomoLogs: FomoLog[];
  isLoading: boolean;

  // Actions
  setUser: (user: Omit<User, "password"> | null) => void;
  setAttendance: (attendance: Attendance[]) => void;
  addAttendance: (record: Attendance) => void;
  setFomoLogs: (logs: FomoLog[]) => void;
  addFomoLog: (log: FomoLog) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  attendance: [],
  fomoLogs: [],
  isLoading: false,

  setUser: (user) => set({ user }),
  setAttendance: (attendance) => set({ attendance }),
  addAttendance: (record) =>
    set((state) => ({ attendance: [record, ...state.attendance] })),
  setFomoLogs: (fomoLogs) => set({ fomoLogs }),
  addFomoLog: (log) =>
    set((state) => ({ fomoLogs: [log, ...state.fomoLogs] })),
  setLoading: (isLoading) => set({ isLoading }),
}));
