// Mock Google Calendar integration
// In production, this would use the Google Calendar API

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "lecture" | "lab" | "seminar" | "study" | "free";
}

export interface CalendarStats {
  todayTasks: string[];
  freeHours: number;
  studiedHours: number;
  events: CalendarEvent[];
  nextEvent: CalendarEvent | null;
  freeSlots: { start: string; end: string; duration: number }[];
}

// Generate realistic demo calendar data
export function getMockCalendarData(): CalendarStats {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  
  // Demo events for today
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Matematinė analizė",
      startTime: `${today}T08:00:00`,
      endTime: `${today}T09:30:00`,
      type: "lecture",
    },
    {
      id: "2", 
      title: "Programavimo pagrindai",
      startTime: `${today}T10:00:00`,
      endTime: `${today}T11:30:00`,
      type: "lecture",
    },
    {
      id: "3",
      title: "Fizikos laboratorinis",
      startTime: `${today}T13:00:00`,
      endTime: `${today}T14:30:00`,
      type: "lab",
    },
    {
      id: "4",
      title: "Anglų kalba",
      startTime: `${today}T15:00:00`,
      endTime: `${today}T16:00:00`,
      type: "seminar",
    },
  ];

  const todayTasks = events.map((e) => e.title);
  
  // Calculate hours
  const lectureHours = events.reduce((acc, e) => {
    const start = new Date(e.startTime);
    const end = new Date(e.endTime);
    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);
  
  // Assume 16 waking hours, calculate free time
  const freeHours = Math.max(0, 16 - lectureHours - 2); // 2h for meals/breaks
  const studiedHours = Math.floor(Math.random() * 3) + 1; // 1-3 hours studied

  // Find next event
  const currentHour = now.getHours();
  const nextEvent = events.find((e) => {
    const eventHour = new Date(e.startTime).getHours();
    return eventHour > currentHour;
  }) || null;

  // Calculate free time slots
  const freeSlots: { start: string; end: string; duration: number }[] = [];
  
  // Morning free slot (before first class)
  if (events.length > 0) {
    const firstEvent = events[0];
    const firstHour = new Date(firstEvent.startTime).getHours();
    if (firstHour > 7) {
      freeSlots.push({
        start: "07:00",
        end: `${String(firstHour).padStart(2, "0")}:00`,
        duration: firstHour - 7,
      });
    }
  }

  // Gaps between events
  for (let i = 0; i < events.length - 1; i++) {
    const currentEnd = new Date(events[i].endTime);
    const nextStart = new Date(events[i + 1].startTime);
    const gapMinutes = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
    
    if (gapMinutes >= 30) {
      freeSlots.push({
        start: currentEnd.toTimeString().slice(0, 5),
        end: nextStart.toTimeString().slice(0, 5),
        duration: gapMinutes / 60,
      });
    }
  }

  // Evening free slot (after last class)
  if (events.length > 0) {
    const lastEvent = events[events.length - 1];
    const lastHour = new Date(lastEvent.endTime).getHours();
    if (lastHour < 22) {
      freeSlots.push({
        start: `${String(lastHour).padStart(2, "0")}:30`,
        end: "22:00",
        duration: 22 - lastHour - 0.5,
      });
    }
  }

  return {
    todayTasks,
    freeHours: Math.round(freeHours * 10) / 10,
    studiedHours,
    events,
    nextEvent,
    freeSlots,
  };
}

// Demo data for preview mode
export function getDemoCalendarData(): CalendarStats {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Matematinė analizė",
      startTime: `${today}T08:00:00`,
      endTime: `${today}T09:30:00`,
      type: "lecture",
    },
    {
      id: "2",
      title: "Programavimo pagrindai", 
      startTime: `${today}T10:00:00`,
      endTime: `${today}T11:30:00`,
      type: "lecture",
    },
    {
      id: "3",
      title: "Fizikos laboratorinis",
      startTime: `${today}T13:00:00`,
      endTime: `${today}T14:30:00`,
      type: "lab",
    },
    {
      id: "4",
      title: "Anglų kalba",
      startTime: `${today}T15:00:00`,
      endTime: `${today}T16:00:00`,
      type: "seminar",
    },
  ];

  const currentHour = now.getHours();
  const nextEvent = events.find((e) => {
    const eventHour = new Date(e.startTime).getHours();
    return eventHour > currentHour;
  }) || null;

  return {
    todayTasks: events.map((e) => e.title),
    freeHours: 6.5,
    studiedHours: 2,
    events,
    nextEvent,
    freeSlots: [
      { start: "09:30", end: "10:00", duration: 0.5 },
      { start: "11:30", end: "13:00", duration: 1.5 },
      { start: "14:30", end: "15:00", duration: 0.5 },
      { start: "16:00", end: "22:00", duration: 6 },
    ],
  };
}

// Simulate OAuth connection
export async function connectGoogleCalendar(userId: string): Promise<boolean> {
  console.log(`Connecting Google Calendar for user: ${userId}`);
  return true;
}
