import { getUser } from "@/actions/auth";
import { getUserStats, getGroupStats, getFomoFeed } from "@/actions/fomo";
import { getFreeHours } from "@/actions/calendar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FomoGenerator } from "@/components/FomoGenerator";
import { CalendarConnect } from "@/components/CalendarConnect";

export default async function DashboardPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const [userStats, groupStats, fomoFeed, calendarData] = await Promise.all([
    getUserStats(),
    getGroupStats(),
    getFomoFeed(5),
    getFreeHours(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statistika</h1>
          <p className="text-muted text-sm">{user.full_name || user.email}</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-surface border border-muted/20 rounded-lg hover:border-accent transition-colors"
        >
          ← Atgal
        </Link>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Laisvos valandos</p>
          <p className="text-3xl font-bold text-accent">{calendarData.freeHours}h</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Mokymosi valandos</p>
          <p className="text-3xl font-bold">{calendarData.studiedHours}h</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Įėjimai šiandien</p>
          <p className="text-3xl font-bold">{userStats?.attendanceEnter || 0}</p>
        </div>
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <p className="text-muted text-xs uppercase tracking-wide mb-1">Išėjimai šiandien</p>
          <p className="text-3xl font-bold">{userStats?.attendanceExit || 0}</p>
        </div>
      </div>

      {/* Group Comparison */}
      <div className="p-4 bg-surface border border-muted/20 rounded-xl">
        <h2 className="text-sm font-medium text-muted mb-3">Grupės vidurkis</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Vid. mokymosi</p>
            <p className="text-xl font-bold">{groupStats.avgStudyHours}h</p>
          </div>
          <div>
            <p className="text-xs text-muted">Vid. lankomumas</p>
            <p className="text-xl font-bold">{groupStats.avgAttendance}</p>
          </div>
        </div>
        
        {/* Comparison indicator */}
        {userStats && (
          <div className="mt-4 pt-4 border-t border-muted/10">
            <p className="text-xs text-muted">
              Tu mokėsi{" "}
              <span className={userStats.studiedHours >= groupStats.avgStudyHours ? "text-green-400" : "text-accent"}>
                {userStats.studiedHours >= groupStats.avgStudyHours ? "+" : ""}
                {(userStats.studiedHours - groupStats.avgStudyHours).toFixed(1)}h
              </span>
              {" "}palyginus su grupe
            </p>
          </div>
        )}
      </div>

      {/* Calendar Connection */}
      <CalendarConnect isConnected={user.gcal_connected} />

      {/* Today's Tasks */}
      {calendarData.todayTasks.length > 0 && (
        <div className="p-4 bg-surface border border-muted/20 rounded-xl">
          <h2 className="text-sm font-medium text-muted mb-3">Šiandienos užduotys</h2>
          <ul className="space-y-2">
            {calendarData.todayTasks.map((task, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FOMO Generator */}
      <FomoGenerator />

      {/* FOMO Feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted">Paskutiniai FOMO pranešimai</h2>
        
        {fomoFeed.length === 0 ? (
          <p className="text-muted text-sm p-4 bg-surface border border-muted/20 rounded-xl">
            Dar nėra FOMO pranešimų. Sugeneruok pirmą!
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}

