export type Activity = {
  name: string;
  start_time: string;
  end_time: string | null;
  date: string;
  isRecuring: boolean;
};

export type CreateScheduleInput = {
  scheduleId: string;
  activities: Activity[];
};
