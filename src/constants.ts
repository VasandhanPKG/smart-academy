import { Faculty, Course, StudentGroup, Room, TimeSlot, Day, TimetableData } from './types';

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const SLOTS: TimeSlot[] = [
  { id: 's1', startTime: '09:00', endTime: '10:00' },
  { id: 's2', startTime: '10:00', endTime: '11:00' },
  { id: 's3', startTime: '11:00', endTime: '12:00' },
  { id: 's4', startTime: '12:00', endTime: '13:00' },
  { id: 's5', startTime: '13:00', endTime: '14:00' }, // Lunch/Break usually, but user asked for 9 periods
  { id: 's6', startTime: '14:00', endTime: '15:00' },
  { id: 's7', startTime: '15:00', endTime: '16:00' },
  { id: 's8', startTime: '16:00', endTime: '17:00' },
  { id: 's9', startTime: '17:00', endTime: '18:00' },
];

export const MOCK_DATA: TimetableData = {
  days: DAYS,
  slots: SLOTS,
  faculty: [
    {
      id: 'f1',
      name: 'Dr. Alan Turing',
      department: 'Computer Science',
      subjects: ['cs101', 'cs302'],
      availability: { days: DAYS, slots: SLOTS.map(s => s.id) },
      maxLoad: 18,
      attendance: 98.5,
    },
    {
      id: 'f2',
      name: 'Dr. Grace Hopper',
      department: 'Computer Science',
      subjects: ['cs102', 'cs201'],
      availability: { days: DAYS, slots: SLOTS.map(s => s.id) },
      maxLoad: 15,
      attendance: 95.2,
    },
    {
      id: 'f3',
      name: 'Prof. Richard Feynman',
      department: 'Physics',
      subjects: ['ph101', 'ph202'],
      availability: { days: DAYS, slots: SLOTS.map(s => s.id) },
      maxLoad: 12,
      attendance: 92.8,
    },
    {
      id: 'f4',
      name: 'Dr. Ada Lovelace',
      department: 'Mathematics',
      subjects: ['ma101'],
      availability: { days: DAYS, slots: SLOTS.map(s => s.id) },
      maxLoad: 15,
      attendance: 99.1,
    },
  ],
  courses: [
    { id: 'cs101', name: 'Intro to CS', department: 'Computer Science', sessionsPerWeek: 4, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
    { id: 'cs102', name: 'Data Structures', department: 'Computer Science', sessionsPerWeek: 4, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
    { id: 'cs201', name: 'Algorithms', department: 'Computer Science', sessionsPerWeek: 3, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
    { id: 'cs302', name: 'Operating Systems', department: 'Computer Science', sessionsPerWeek: 2, type: 'Lab', duration: 2, requiredRoomType: 'Lab' },
    { id: 'ph101', name: 'General Physics', department: 'Physics', sessionsPerWeek: 4, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
    { id: 'ph202', name: 'Quantum Mechanics', department: 'Physics', sessionsPerWeek: 3, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
    { id: 'ma101', name: 'Discrete Math', department: 'Mathematics', sessionsPerWeek: 4, type: 'Lecture', duration: 1, requiredRoomType: 'Classroom' },
  ],
  groups: [
    { id: 'g1', name: 'Class A (63 Students)', department: 'Computer Science', semester: 1, courses: ['cs101', 'cs102', 'ph101', 'ma101'], attendance: 88.4 },
    { id: 'g2', name: 'CS Year 2', department: 'Computer Science', semester: 3, courses: ['cs201', 'cs302', 'ph202'], attendance: 91.2 },
  ],
  rooms: [
    { id: 'r101', name: 'Lecture Hall A', type: 'Classroom', capacity: 80 }, // Fits 63
    { id: 'r102', name: 'Room 102', type: 'Classroom', capacity: 40 },
    { id: 'l101', name: 'CS Lab 1', type: 'Lab', capacity: 30 },
  ],
};
