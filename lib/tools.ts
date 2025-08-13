import { Type } from "@google/genai";


export const extractDataSchema = {
  name: "extract_schedule_from_pdf",
  description:
    "Extracts structured schedule entries from a timetable PDF, combining consecutive blocks for the same class into one entry with an extended end time.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      schedule_entries: {
        type: Type.ARRAY,
        description:
          "List of schedule entries extracted from the PDF. Consecutive hourly blocks for the same course, location, and day must be merged into a single entry with a combined time range.",
        items: {
          type: Type.OBJECT,
          properties: {
            course_name: {
              type: Type.STRING,
              description: "Course code and name (e.g., 'ME 473').",
            },
            day: {
              type: Type.STRING,
              description: "Day of the week for the class (e.g., 'Monday').",
            },
            start_time: {
              type: Type.STRING,
              description: "Start time in HH:MM 24-hour format (e.g., '08:00').",
            },
            end_time: {
              type: Type.STRING,
              description:
                "End time in HH:MM 24-hour format, extended if class spans multiple consecutive blocks (e.g., '09:55' or '10:55').",
            },
            location: {
              type: Type.STRING,
              description: "Room or venue of the class (e.g., 'D/E 303').",
            },
            lecturer: {
              type: Type.STRING,
              description: "Lecturer name(s) if available.",
            },
          },
          required: ["course_name", "day", "start_time", "end_time", "location"],
        },
      },
    },
    required: ["schedule_entries"],
  },
};

export const reportStatusSchema = {
  name: "report_processing_status",
  description: "Reports whether processing was successful or failed with a short reason.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      message: { type: Type.STRING, description: "Short status message (max 5 words)." },
      action: { type: Type.STRING, enum: ["success", "failure"] },
    },
    required: ["message", "action"],
  },
};