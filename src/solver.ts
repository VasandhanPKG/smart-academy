import { TimetableData, OptimizationResult, ScheduledSession, Day, Faculty, Course, StudentGroup, Room } from './types';

export function optimizeTimetable(data: TimetableData): OptimizationResult {
  const { faculty, courses, groups, rooms, slots, days } = data;
  const sessions: ScheduledSession[] = [];
  const conflicts: string[] = [];

  // Helper to track assignments
  const facultyBusy = new Set<string>(); // "facultyId-day-slotId"
  const roomBusy = new Set<string>();    // "roomId-day-slotId"
  const groupBusy = new Set<string>();   // "groupId-day-slotId"
  const facultyLoad = new Map<string, number>();

  // Prepare all sessions to be scheduled
  const sessionsToSchedule: { course: Course, group: StudentGroup, faculty: Faculty }[] = [];
  
  groups.forEach(group => {
    group.courses.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      const assignedFaculty = faculty.find(f => f.subjects.includes(courseId));
      
      if (course && assignedFaculty) {
        for (let i = 0; i < course.sessionsPerWeek; i++) {
          sessionsToSchedule.push({ course, group, faculty: assignedFaculty });
        }
      } else {
        conflicts.push(`Missing faculty or course definition for ${courseId} in group ${group.name}`);
      }
    });
  });

  // Sort sessions: Labs first (usually harder to place), then by duration
  sessionsToSchedule.sort((a, b) => {
    if (a.course.type === 'Lab' && b.course.type !== 'Lab') return -1;
    if (a.course.type !== 'Lab' && b.course.type === 'Lab') return 1;
    return b.course.duration - a.course.duration;
  });

  // Simple Greedy Placement with basic backtracking/retry
  for (const item of sessionsToSchedule) {
    const { course, group, faculty: f } = item;
    let placed = false;

    // Try to find a slot
    // Shuffling days/slots slightly could lead to better distribution, but let's be deterministic for now
    for (const day of days) {
      if (placed) break;
      
      for (let i = 0; i <= slots.length - course.duration; i++) {
        const potentialSlots = slots.slice(i, i + course.duration);
        const slotIds = potentialSlots.map(s => s.id);

        // Check Hard Constraints
        const isFacultyAvailable = slotIds.every(sid => 
          f.availability.days.includes(day) && 
          f.availability.slots.includes(sid) &&
          !facultyBusy.has(`${f.id}-${day}-${sid}`)
        );

        const isGroupAvailable = slotIds.every(sid => 
          !groupBusy.has(`${group.id}-${day}-${sid}`)
        );

        const currentLoad = facultyLoad.get(f.id) || 0;
        const isLoadOk = currentLoad + course.duration <= f.maxLoad;

        if (isFacultyAvailable && isGroupAvailable && isLoadOk) {
          // Find an available room
          const availableRoom = rooms.find(r => 
            r.type === course.requiredRoomType &&
            slotIds.every(sid => !roomBusy.has(`${r.id}-${day}-${sid}`))
          );

          if (availableRoom) {
            // Place it!
            const session: ScheduledSession = {
              id: Math.random().toString(36).substr(2, 9),
              courseId: course.id,
              facultyId: f.id,
              groupId: group.id,
              roomId: availableRoom.id,
              day,
              slotIds,
            };

            sessions.push(session);
            slotIds.forEach(sid => {
              facultyBusy.add(`${f.id}-${day}-${sid}`);
              groupBusy.add(`${group.id}-${day}-${sid}`);
              roomBusy.add(`${availableRoom.id}-${day}-${sid}`);
            });
            facultyLoad.set(f.id, currentLoad + course.duration);
            placed = true;
            break;
          }
        }
      }
    }

    if (!placed) {
      conflicts.push(`Could not schedule ${course.name} for ${group.name} with ${f.name}`);
    }
  }

  // Calculate metrics
  const totalPossibleSlots = rooms.length * days.length * slots.length;
  const usedSlots = sessions.reduce((acc, s) => acc + s.slotIds.length, 0);
  
  const facultyLoadDist: Record<string, number> = {};
  faculty.forEach(f => {
    facultyLoadDist[f.name] = facultyLoad.get(f.id) || 0;
  });

  return {
    sessions,
    conflicts,
    metrics: {
      totalSessions: sessions.length,
      roomUtilization: (usedSlots / totalPossibleSlots) * 100,
      facultyLoadDistribution: facultyLoadDist,
    }
  };
}
