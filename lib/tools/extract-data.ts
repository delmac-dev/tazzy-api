import { RRule } from "rrule";
import { parseTime, RULE_BY_DAY } from "../utils";
import { supaClient } from "../supabase";

export type Props = {
  data: {
    course_name: string,
    lecturer: string,
    start_time: string,
    end_time: string,
    location: string,
    day: string
  }[],
  scheduleID: string,
  userID: string
}

export async function extractPDF({ data, scheduleID, userID }: Props) {
  const supabase = supaClient();

  // TODO: future let user set start and end date for schedule

  const activityPayload = data.map(data => ({
    owner_id: userID,
    schedule_id: scheduleID,
    name: data.course_name,
    status: "active",
    accessibility: "private",
    start_time: parseTime(data.start_time),
    end_time: parseTime(data.end_time),
    location: { type: "text", value: data.location },
    recurrence: null
  }));
  
  const { data: activityData, error: activityError } = await supabase
    .from("activities")
    .insert(activityPayload)
    .select("id, start_time, end_time");

  console.log("payload");
  
  if (activityError) throw activityError;
  const instancesPayload = activityData.map(({ id, start_time, end_time }, index) => {
    const day = data[index].day as keyof typeof RULE_BY_DAY;

    const rule = new RRule({
      ...RRule.parseString(RULE_BY_DAY[day]),
      dtstart: new Date(),
      count: 8
    });

    const instanceDates = rule.all().map(d => d.toISOString().split("T")[0]);
    return instanceDates.map(date => ({
      owner_id: userID,
      schedule_id: scheduleID,
      activity_id: id,
      type: "recurrence",
      date: date,
      start_time: start_time,
      end_time: end_time,
      location: { type: "text", value: data[index].location }
    }));
  }).flat();

  const { error: instanceError } = await supabase
    .from("activity_instances")
    .insert(instancesPayload);
    
  if (instanceError) throw instanceError;

  console.log("done instances")

  const relationPayload = activityData.map(({ id }) => ({
    schedule_id: scheduleID,
    activity_id: id,
    access_level: "owner"
  }));

  const { error: schedError } = await supabase
    .from("schedule_activity")
    .insert(relationPayload);

  if (schedError) throw schedError;
  console.log("done all");
}