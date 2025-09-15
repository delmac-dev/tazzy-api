import { Activity } from "./types";

const schedules = new Map<string, Activity[]>();

export function saveActivities(scheduleId: string, activities: Activity[]) {
  schedules.set(scheduleId, activities);
}

export function getActivities(scheduleId: string): Activity[] | undefined {
  return schedules.get(scheduleId);
}
