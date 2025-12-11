import { getUser } from "@/actions/auth";
import { getLatestAttendance } from "@/actions/attendance";
import { getFomoFeed } from "@/actions/fomo";
import { getDemoCalendarData } from "@/lib/calendar";
import Link from "next/link";
import { FomoGenerator } from "@/components/FomoGenerator";
import { LogoutButton } from "@/components/LogoutButton";
import { CalendarView } from "@/components/CalendarView";

// Demo data for preview
const demoAttendance = [
  { id: "1", action: "enter" as const, room_id: "A101", timestamp: new Date().toISOString(), user_id: "demo" },
  { id: "2", action: "exit" as const, room_id: "B205", timestamp: new Date(Date.now() - 3600000).toISOString(), user_id: "demo" },
  { id: "3", action: "enter" as const, room_id: "C302", timestamp: new Date(Date.now() - 7200000).toISOString(), user_id: "demo" },
];

const demoFomoMessages = [
  { id: "1", message: "Grupė mokėsi 5.2h, tu tik 2h. Ką darai?", created_at: new Date().toISOString() },
  { id: "2", message: "6h laisvo laiko ir nieko nepadarei? Grupė tau nebelauks.", created_at: new Date(Date.now() - 3600000).toISOString() },
];

export default async function HomePage() {
  const user = await getUser();
  const attendance = user ? await getLatestAttendance() : demoAttendance;
  const fomoFeed = user ? await getFomoFeed(3) : demoFomoMessages;
  const demoCalendar = getDemoCalendarData();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Preview mode (not logged in)
  if (!user) {
    return (
      <div className="space-y-8">
        {/* Preview Banner */}
        <div className="p-3 bg-accent/20 border border-accent/40 rounded-xl text-center">
          <p className="text-sm">
            👀 Peržiūros režimas •{" "}
            <Link href="/login" className="underline hover:text-accent">
              Prisijunk
            </Link>{" "}
            arba{" "}
            <Link href="/signup" className="underline hover:text-accent">
              registruokis
            </Link>{" "}
            kad naudotum
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent">FQR</h1>
            <p className="text-muted text-sm">NFC lankomumo sistema su AI FOMO</p>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg text-sm font-medium transition-colors"
          >
            Prisijungti
          </Link>
        </div>

        {/* Calendar View */}
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <CalendarView data={demoCalendar} isDemo={true} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-surface border border-muted/20 rounded-xl opacity-80">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-1">NFC Skenavimas</h3>
            <p className="text-xs text-muted">Palieskite telefoną prie žymos</p>
          </div>

          <Link
            href="/dashboard-preview"
            className="p-6 bg-surface border border-muted/20 rounded-xl hover:border-accent transition-all group"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-medium mb-1">Statistika</h3>
            <p className="text-xs text-muted">Peržiūrėti demo</p>
          </Link>
        </div>

        {/* Demo Attendance */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">Lankomumo pavyzdys</h2>
          <div className="space-y-2">
            {demoAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-surface border border-muted/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      record.action === "enter" ? "bg-green-400" : "bg-accent"
                    }`}
                  />
                  <span className="text-sm">
                    {record.action === "enter" ? "Įėjimas" : "Išėjimas"}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {record.room_id}
                  </span>
                </div>
                <span className="text-xs text-muted font-mono">
                  {formatTime(record.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo FOMO Button (disabled) */}
        <div className="space-y-4">
          <button
            disabled
            className="w-full py-4 bg-accent/50 cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generuoti FOMO
          </button>
          <p className="text-center text-xs text-muted">Prisijunk kad generuotum savo FOMO</p>
        </div>

        {/* Demo FOMO Feed */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">FOMO pranešimų pavyzdžiai</h2>
          <div className="space-y-2">
            {demoFomoMessages.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-surface border border-accent/30 rounded-xl"
              >
                <p className="text-sm leading-relaxed">{log.message}</p>
                <p className="text-xs text-muted mt-2">Pavyzdinis pranešimas</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-surface border border-accent/30 rounded-xl text-center space-y-4">
          <h3 className="font-bold text-lg">Nori išbandyti?</h3>
          <p className="text-muted text-sm">Registruokis ir gauk asmeninius FOMO pranešimus</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-accent hover:bg-accent/90 rounded-lg font-medium transition-colors"
            >
              Registruotis
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-surface border border-muted/20 hover:border-accent rounded-lg font-medium transition-colors"
            >
              Prisijungti
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent">FQR</h1>
          <p className="text-muted text-sm">Sveiki, {user.full_name || user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/scan?id=A101"
          className="p-6 bg-surface border border-muted/20 rounded-xl hover:border-accent transition-all group"
        >
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
            <svg
              className="w-6 h-6 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-medium mb-1">Simuliuoti skenavimą</h3>
          <p className="text-xs text-muted">Auditorija A101</p>
        </Link>

        <Link
          href="/dashboard"
          className="p-6 bg-surface border border-muted/20 rounded-xl hover:border-accent transition-all group"
        >
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
            <svg
              className="w-6 h-6 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="font-medium mb-1">Statistika</h3>
          <p className="text-xs text-muted">Peržiūrėti dashboardą</p>
        </Link>
      </div>

      {/* Latest Attendance */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Paskutinis lankomumas</h2>
        
        {attendance.length === 0 ? (
          <div className="p-4 bg-surface border border-muted/20 rounded-xl">
            <p className="text-muted text-sm">Dar nėra lankomumo įrašų</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-surface border border-muted/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      record.action === "enter" ? "bg-green-400" : "bg-accent"
                    }`}
                  />
                  <span className="text-sm">
                    {record.action === "enter" ? "Įėjimas" : "Išėjimas"}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {record.room_id}
                  </span>
                </div>
                <span className="text-xs text-muted font-mono">
                  {formatTime(record.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOMO Section */}
      <FomoGenerator />

      {/* FOMO Feed */}
      {fomoFeed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">FOMO pranešimai</h2>
          <div className="space-y-2">
            {fomoFeed.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-surface border border-accent/30 rounded-xl"
              >
                <p className="text-sm leading-relaxed">{log.message}</p>
                <p className="text-xs text-muted mt-2">
                  {new Date(log.created_at).toLocaleString("lt-LT")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
