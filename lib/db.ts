// Simple in-memory + localStorage database for MVP
// No external services required

export interface User {
  id: string;
  email: string;
  full_name: string;
  gcal_connected: boolean;
  password: string; // In production, this would be hashed
}

export interface Attendance {
  id: string;
  user_id: string;
  room_id: string;
  action: "enter" | "exit";
  timestamp: string;
}

export interface FomoLog {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

// Generate simple IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Use global to persist across hot reloads in development
const globalForDb = globalThis as unknown as {
  memoryStore: {
    users: User[];
    attendance: Attendance[];
    fomoLogs: FomoLog[];
    sessions: Map<string, string>;
  } | undefined;
};

// In-memory storage (server-side)
const memoryStore = globalForDb.memoryStore ?? {
  users: [] as User[],
  attendance: [] as Attendance[],
  fomoLogs: [] as FomoLog[],
  sessions: new Map<string, string>(),
};

// Persist in development
if (process.env.NODE_ENV !== "production") {
  globalForDb.memoryStore = memoryStore;
}

// Initialize with demo user if empty
if (memoryStore.users.length === 0) {
  memoryStore.users.push({
    id: "demo-user-1",
    email: "demo@fqr.lt",
    full_name: "Demo Vartotojas",
    gcal_connected: false,
    password: "demo123",
  });
}

export const db = {
  // Users
  getUsers: () => memoryStore.users,
  
  getUserById: (id: string) => memoryStore.users.find((u) => u.id === id),
  
  getUserByEmail: (email: string) => 
    memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  
  createUser: (user: Omit<User, "id">) => {
    const newUser = { ...user, id: generateId() };
    memoryStore.users.push(newUser);
    return newUser;
  },
  
  updateUser: (id: string, updates: Partial<User>) => {
    const index = memoryStore.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      memoryStore.users[index] = { ...memoryStore.users[index], ...updates };
      return memoryStore.users[index];
    }
    return null;
  },

  // Sessions
  createSession: (userId: string) => {
    const sessionId = generateId();
    memoryStore.sessions.set(sessionId, userId);
    return sessionId;
  },
  
  getSession: (sessionId: string) => memoryStore.sessions.get(sessionId),
  
  deleteSession: (sessionId: string) => memoryStore.sessions.delete(sessionId),

  // Attendance
  getAttendance: () => memoryStore.attendance,
  
  getAttendanceByUserId: (userId: string) =>
    memoryStore.attendance
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  
  getAttendanceByUserAndRoom: (userId: string, roomId: string, since: Date) =>
    memoryStore.attendance.filter(
      (a) =>
        a.user_id === userId &&
        a.room_id === roomId &&
        new Date(a.timestamp) >= since
    ),
  
  createAttendance: (attendance: Omit<Attendance, "id">) => {
    const newAttendance = { ...attendance, id: generateId() };
    memoryStore.attendance.push(newAttendance);
    return newAttendance;
  },

  // FOMO Logs
  getFomoLogs: () => memoryStore.fomoLogs,
  
  getFomoLogsByUserId: (userId: string, limit = 10) =>
    memoryStore.fomoLogs
      .filter((f) => f.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit),
  
  createFomoLog: (log: Omit<FomoLog, "id">) => {
    const newLog = { ...log, id: generateId() };
    memoryStore.fomoLogs.push(newLog);
    return newLog;
  },
};
