"use client";

import { type CalendarStats } from "@/lib/calendar";

interface CalendarViewProps {
  data: CalendarStats;
  isDemo?: boolean;
}

export function CalendarView({ data, isDemo = false }: CalendarViewProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-500/20 border-blue-500/40 text-blue-300";
      case "lab":
        return "bg-green-500/20 border-green-500/40 text-green-300";
      case "seminar":
        return "bg-purple-500/20 border-purple-500/40 text-purple-300";
      case "study":
        return "bg-yellow-500/20 border-yellow-500/40 text-yellow-300";
      default:
        return "bg-muted/20 border-muted/40 text-muted";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "lecture":
        return "Paskaita";
      case "lab":
        return "Laboratorinis";
      case "seminar":
        return "Seminaras";
      case "study":
        return "Mokymasis";
      default:
        return "Kita";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-accent"
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
        <h3 className="text-sm font-medium">
          Pagal tavo kalendorių
          {isDemo && <span className="text-muted ml-1">(demo)</span>}
        </h3>
      </div>

      {/* Next Event Alert */}
      {data.nextEvent && (
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs text-accent font-medium">Kita paskaita</span>
          </div>
          <p className="font-medium">{data.nextEvent.title}</p>
          <p className="text-sm text-muted">
            {formatTime(data.nextEvent.startTime)} - {formatTime(data.nextEvent.endTime)}
          </p>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="space-y-2">
        <p className="text-xs text-muted uppercase tracking-wide">Šiandienos tvarkaraštis</p>
        <div className="space-y-1.5">
          {data.events.map((event) => (
            <div
              key={event.id}
              className={`p-2.5 rounded-lg border ${getEventColor(event.type)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs opacity-70">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)} • {getEventTypeLabel(event.type)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Time Slots */}
      {data.freeSlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted uppercase tracking-wide">Laisvas laikas mokytis</p>
          <div className="grid grid-cols-2 gap-2">
            {data.freeSlots.map((slot, i) => (
              <div
                key={i}
                className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-sm font-medium text-green-300">
                  {slot.start} - {slot.end}
                </p>
                <p className="text-xs text-green-400/70">
                  {slot.duration >= 1 ? `${slot.duration}h` : `${Math.round(slot.duration * 60)}min`} laisvo
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="p-3 bg-surface border border-muted/20 rounded-xl">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-accent">{data.freeHours}h</p>
            <p className="text-xs text-muted">Laisvo</p>
          </div>
          <div>
            <p className="text-lg font-bold">{data.events.length}</p>
            <p className="text-xs text-muted">Užsiėmimai</p>
          </div>
          <div>
            <p className="text-lg font-bold">{data.studiedHours}h</p>
            <p className="text-xs text-muted">Mokytasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

