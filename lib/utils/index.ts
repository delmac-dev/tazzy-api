
export function parseTime(time: string) {
  // If time is already in HH:mm:ss format, return it as is
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;

  // If in HH:mm format, append ":00"
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;

  throw new Error(`Invalid time format: ${time}`);
};

export const RULE_BY_DAY = {
  Monday: "FREQ=WEEKLY;BYDAY=MO",
  Tuesday: "FREQ=WEEKLY;BYDAY=TU",
  Wednesday: "FREQ=WEEKLY;BYDAY=WE",
  Thursday: "FREQ=WEEKLY;BYDAY=TH",
  Friday: "FREQ=WEEKLY;BYDAY=FR",
  Saturday: "FREQ=WEEKLY;BYDAY=SA",
  Sunday: "FREQ=WEEKLY;BYDAY=SU"
};