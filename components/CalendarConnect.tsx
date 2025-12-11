"use client";

import { importCalendarMock, disconnectCalendar } from "@/actions/calendar";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CalendarConnectProps {
  isConnected: boolean;
}

export function CalendarConnect({ isConnected }: CalendarConnectProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConnect() {
    setLoading(true);
    await importCalendarMock();
    router.refresh();
    setLoading(false);
  }

  async function handleDisconnect() {
    setLoading(true);
    await disconnectCalendar();
    router.refresh();
    setLoading(false);
  }

  if (isConnected) {
    return (
      <div className="p-4 bg-surface border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Google Calendar prijungtas</p>
              <p className="text-xs text-muted">Duomenys sinchronizuojami</p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="text-xs text-muted hover:text-accent transition-colors"
          >
            {loading ? "..." : "Atjungti"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface border border-muted/20 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Importuoti kalendorių</p>
            <p className="text-xs text-muted">Prijunkite Google Calendar</p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 text-xs bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-lg transition-colors"
        >
          {loading ? "Jungiama..." : "Prijungti"}
        </button>
      </div>
    </div>
  );
}

