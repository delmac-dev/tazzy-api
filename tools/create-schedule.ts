import { tool } from "ai";
import z from "zod";
import { saveActivities } from "../lib/store";

export const CreateScheduleInput = z.object({
  scheduleId: z.string().min(1),
  activities: z.array(
    z.object({
      name: z.string().min(1),
      start_time: z.string().min(1),
      end_time: z.string().nullable(),
      date: z.string().min(1),
      isRecuring: z.boolean(),
    })
  ).min(1),
});

export type CreateScheduleInput = z.infer<typeof CreateScheduleInput>;

export const createSchedule = tool({
  description: "Persist a list of schedule activities with consolidation already applied",
  inputSchema: CreateScheduleInput,
  execute: async (input: CreateScheduleInput) => {
    const { scheduleId, activities } = input;
    console.log(JSON.stringify(input, null, 2));
    saveActivities(scheduleId, activities);
    return {
      success: true,
      message: `Saved ${activities.length} activities for schedule ${scheduleId}`,
    };
  },
});

export default createSchedule;