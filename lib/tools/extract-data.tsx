import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/database";
import { RRule } from "rrule";

function parseTime(time: string) {
  // If time is already in HH:mm:ss format, return it as is
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;

  // If in HH:mm format, append ":00"
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;

  throw new Error(`Invalid time format: ${time}`);
}

export function client() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!
  );
};

const rruleByDay = {
  Monday: "FREQ=WEEKLY;BYDAY=MO",
  Tuesday: "FREQ=WEEKLY;BYDAY=TU",
  Wednesday: "FREQ=WEEKLY;BYDAY=WE",
  Thursday: "FREQ=WEEKLY;BYDAY=TH",
  Friday: "FREQ=WEEKLY;BYDAY=FR",
  Saturday: "FREQ=WEEKLY;BYDAY=SA",
  Sunday: "FREQ=WEEKLY;BYDAY=SU"
};

const supabase = client();

export async function extractPDF(data:any[], scheduleID:string, userID:string) {
    for (const item of data) {

        const startTimeFormatted = parseTime(item.start_time);
        const endTimeFormatted = parseTime(item.end_time);

        const { data: activityRes, error: activityError } = await supabase
        .from("activities")
        .insert({
            owner_id: userID,
            schedule_id: scheduleID,
            name: item.course_name,
            status: "active",
            accessibility: "private",
            date: null,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted,
            location: { type: "text", value: item.location },
            recurrence: null
        })
        .select("id")
        .single();
        
        if (activityError) throw activityError;
        const activityId = activityRes.id;

        const today = new Date();
        const weeks = 8;
        const untilDate = new Date(today);
        untilDate.setDate(today.getDate() + weeks * 7);
        const day = item.day as keyof typeof rruleByDay;
        let instanceDates: string[] = [];
                
        const rule = new RRule({
        ...RRule.parseString(rruleByDay[day]),
        dtstart: today,
        until: untilDate,
        });

        instanceDates = rule.all().map(d => d.toISOString().split("T")[0]);

        const instancesPayload = instanceDates.map(dateStr => ({
            owner_id: userID,
            schedule_id: scheduleID,
            activity_id: activityId,
            type: "recurrence",
            date: dateStr,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted,
            location: { type: "text", value: item.location }
        }));

        const { error: instanceError } = await supabase
        .from("activity_instances")
        .insert(instancesPayload);

    const { error: schedError } = await supabase
    .from("schedule_activity")
    .insert({
      schedule_id: scheduleID,
      activity_id: activityId,
      access_level: "owner"
    });

    if (schedError) throw schedError;


    }
}
