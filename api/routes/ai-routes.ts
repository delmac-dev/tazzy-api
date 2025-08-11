import { FunctionCallingConfigMode, GoogleGenAI, Type } from "@google/genai";
import axios from "axios";
import { type Request, type Response, Router } from "express";
import { extractScheduleFromPDFDeclaration, reportProcessingStatusDeclaration } from "../../lib/tools";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/database";
import { RRule } from "rrule";

const router = Router();

// router.post("/generate", async (req: Request, res: Response) => {
//   // const { id } = req.params;
//   const { prompt, url } = req.body;
//   const ai = new GoogleGenAI({});
//   const fileUrl = url??"";

//   const fileBuffer = await axios.get(fileUrl, {
//     responseType: "arraybuffer"
//   });

//   const contents = [
//     { text: prompt },
//     {
//         inlineData: {
//             data: Buffer.from(fileBuffer.data).toString("base64")
//         }
//     }
//   ];

//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: 'Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about the Q3 planning.',
//     config: {
//       tools: [{
//         functionDeclarations: [extractScheduleFromPDFDeclaration]
//       }],
//     },
//   });

// if (response.functionCalls && response.functionCalls.length > 0) {
//   const functionCall = response.functionCalls[0]; // Assuming one function call
//   console.log(`Function to call: ${functionCall.name}`);
//   console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
//   // In a real app, you would call your actual function here:
//   // const result = await scheduleMeeting(functionCall.args);
// } else {
//   console.log("No function call found in the response.");
//   console.log(response.text);
// }

//   res.json({ prompt, fileUrl });
// });

router.post("/generate", async (req, res) => {
  const { prompt, url, scheduleID, userID } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const fileBuffer = await axios.get(url, { responseType: "arraybuffer" });
  const contents = [
    { text: prompt || "" },
    {
      inlineData: { data: Buffer.from(fileBuffer.data).toString("base64"), mimeType: "application/pdf" }
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents,
    config: {
      systemInstruction: `
        You are a schedule processing assistant.
        If the file and/or prompt contains a timetable or schedule and can be extracted, call extract_schedule_from_pdf.
        If not, call report_processing_status with action=failure and a short reason (max 5 words).
        Never guess data — only call extract_schedule_from_pdf if the schedule info is clearly present.`,
      tools: [{ functionDeclarations: [extractScheduleFromPDFDeclaration, reportProcessingStatusDeclaration] }],
      toolConfig: {
        functionCallingConfig: { mode: FunctionCallingConfigMode.ANY }
      },
      temperature: 0,
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const { name, args } = response.functionCalls[0];

    if (name === "report_processing_status") {
      if (args?.action === "success") {
        return res.status(200).json({ message: args.message });
      } else {
        return res.status(500).json({ message: args?.message });
      }
    }

    if (name === "extract_schedule_from_pdf") {
      extractPDF(args?.schedule_entries as any[], scheduleID, userID)
      return res.status(200).json({ extracted: args });
    }
  }

  res.status(500).json({ message: "No valid tool call." });
});

export default router;

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
