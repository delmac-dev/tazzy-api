import { Router } from "express";
import { google } from '@ai-sdk/google';
import { generateText, tool } from "ai";
import SUPER_PROMPT from "../lib/super-prompt";
import createSchedule from "../tools/create-schedule";
import invalidRequest from "../tools/invalid-request";
import z from "zod";

const router = Router();

const Body = z.object({
  scheduleId: z.string().min(1),
  prompt: z.string().optional(),
  fileUrl: z.url().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { scheduleId, prompt, fileUrl } = parsed.data;

    if (!prompt && !fileUrl) {
      throw new Error("either fileUrl or prompt are required");
    }

    const tools = { createSchedule, invalidRequest } as const;

    const userContent: any[] = [];

    if (prompt) {
      userContent.push({ type: "text", text: `User Request: ${prompt}` });
    }

    if (fileUrl) {
      userContent.push({ type: 'file', data: new URL(fileUrl), mediaType: 'application/pdf' });
    }

    const result = await generateText({
      model: google(process.env.AI_MODEL || 'gemini-2.5-flash'),
      tools,
      messages: [
        { role: 'system', content: SUPER_PROMPT },
        { role: 'user', content: [
          { type: 'text', text: `Schedule ID: ${scheduleId}` },
          ...userContent,
        ]},
      ],
    });

    let toolResult: { success: boolean; message: string };
    if (result.toolResults?.length) {
      const t = result.toolResults[0];
      toolResult = t.output as { success: boolean; message: string };
    } else {
      toolResult = { success: false, message: result.text || 'No tool was called by the AI' };
    }

    res.json({ ...toolResult });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;