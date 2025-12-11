import Link from "next/link";
import { getDemoCalendarData } from "@/lib/calendar";
import { CalendarView } from "@/components/CalendarView";

// Demo data for preview
const demoStats = {
  freeHours: 6.5,
  studiedHours: 2,
  attendanceEnter: 3,
  attendanceExit: 2,
};

const demoGroupStats = {
  avgStudyHours: 5.2,
  avgAttendance: 4,
};

const demoFomoMessages = [
  { id: "1", message: "Grupė mokėsi 5.2h, tu tik 2h. Ką darai?", created_at: new Date().toISOString() },
  { id: "2", message: "6h laisvo laiko ir nieko nepadarei? Grupė tau nebelauks.", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", message: "Visi dirba, o tu turi 6.5h laisvo. Gėda.", created_at: new Date(Date.now() - 7200000).toISOString() },
];

export default function DashboardPreviewPage() {
  const demoCalendar = getDemoCalendarData();

  return (
    <div className="space-y-8">
      {/* Preview Banner */}
      <div className="p-3 bg-accent/20 border border-accent/40 rounded-xl text-center">
        <p className="text-sm">
          👀 Demo peržiūra •{" "}
          <Link href="/login" className="underline hover:text-accent">
            Prisijunk
          </Link>{" "}
          kad matytum savo duomenis
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statistika</h1>
          <p className="text-muted text-sm">Demo Vartotojas</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-surface border border-muted/20 rounded-lg hover:border-accent transition-colors"
        >
          ← Atgal
        </Link>
      </div>

      {/* Calendar View */}
      <div className="p-4 bg-surface border border-muted/20 rounded-xl">
        <CalendarView data={demoCalendar} isDemo={true} />
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Laisvos valandos</p>
          <p className="text-3xl font-bold text-accent">{demoStats.freeHours}h</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Mokymosi valandos</p>
          <p className="text-3xl font-bold">{demoStats.studiedHours}h</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Įėjimai šiandien</p>
          <p className="text-3xl font-bold">{demoStats.attendanceEnter}</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Išėjimai šiandien</p>
          <p className="text-3xl font-bold">{demoStats.attendanceExit}</p>
        </div>
      </div>

      {/* Group Comparison */}
      <div className="p-4 bg-surface border border-muted/20 rounded-xl">
        <h2 className="text-sm font-medium text-muted mb-3">Grupės vidurkis</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Vid. mokymosi</p>
            <p className="text-xl font-bold">{demoGroupStats.avgStudyHours}h</p>
          </div>
          <div>
            <p className="text-xs text-muted">Vid. lankomumas</p>
            <p className="text-xl font-bold">{demoGroupStats.avgAttendance}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-muted/10">
          <p className="text-xs text-muted">
            Tu mokėsi{" "}
            <span className="text-accent">
              {(demoStats.studiedHours - demoGroupStats.avgStudyHours).toFixed(1)}h
            </span>
            {" "}palyginus su grupe
          </p>
        </div>
      </div>

      {/* FOMO Generator (disabled) */}
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

      {/* FOMO Feed */}
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
        <h3 className="font-bold text-lg">Nori savo statistiką?</h3>
        <p className="text-muted text-sm">Registruokis ir sek savo progresą</p>
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
