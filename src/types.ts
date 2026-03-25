export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:00"
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjects: string[]; // Course IDs
  availability: {
    days: Day[];
    slots: string[]; // TimeSlot IDs
  };
  maxLoad: number; // sessions per week
  attendance?: number; // percentage
  preferences?: {
    preferredSlots: string[]; // TimeSlot IDs
  };
}

export interface Course {
  id: string;
  name: string;
  department: string;
  sessionsPerWeek: number;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  duration: number; // in slots (usually 1 or 2)
  requiredRoomType: 'Classroom' | 'Lab';
}

export interface StudentGroup {
  id: string;
  name: string;
  department: string;
  semester: number;
  courses: string[]; // Course IDs
  attendance?: number; // percentage
}

export interface Room {
  id: string;
  name: string;
  type: 'Classroom' | 'Lab';
  capacity: number;
}

export interface ScheduledSession {
  id: string;
  courseId: string;
  facultyId: string;
  groupId: string;
  roomId: string;
  day: Day;
  slotIds: string[];
}

export interface TimetableData {
  faculty: Faculty[];
  courses: Course[];
  groups: StudentGroup[];
  rooms: Room[];
  slots: TimeSlot[];
  days: Day[];
}

export interface OptimizationResult {
  sessions: ScheduledSession[];
  conflicts: string[];
  metrics: {
    totalSessions: number;
    roomUtilization: number;
    facultyLoadDistribution: Record<string, number>;
  };
}
