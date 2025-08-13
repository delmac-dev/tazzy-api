import{ FunctionCallingConfigMode, GoogleGenAI, Type } from "@google/genai";
import axios from "axios";
import { Router } from "express";
import { extractDataSchema, reportStatusSchema } from "../../lib/tools";
import { RRule } from "rrule";
import { extractPDF, Props as ExtractProps } from "../../lib/tools/extract-data";

const router = Router();

router.post("/generate", async (req, res) => {
  const { prompt, url, scheduleID, userID } = req.body;

  console.log("START", prompt, url, scheduleID, userID);
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const fileBuffer = await axios.get(url, { responseType: "arraybuffer" });
    const contents = [
      { text: prompt || "" },
      {
        inlineData: { data: Buffer.from(fileBuffer.data).toString("base64"), mimeType: "application/pdf" }
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `
        You are a schedule processing assistant.
        If the file and/or prompt contains a timetable or schedule and can be extracted, call extract_schedule_from_pdf.
        If not, call report_processing_status with action=failure and a short reason (max 5 words).
        Never guess data — only call extract_schedule_from_pdf if the schedule info is clearly present.`,
        tools: [{ functionDeclarations: [extractDataSchema, reportStatusSchema] }],
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
        console.log("run")
        await extractPDF({
          userID,
          scheduleID,
          data: args?.schedule_entries as ExtractProps["data"],
        });
        return res.status(200).json({ message: "Done" });
      };
    }

    res.status(500).json({ message: "An unknown error occurred" });
  } catch (error: any) {
    res.status(500).json({ error: error.name, message: error.message })
  }
});

export default router;
