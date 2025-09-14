import { Router } from "express";
import { google } from '@ai-sdk/google';
import { generateText, tool } from "ai";
import z from "zod";


const router = Router();

const tools = {
  invalidRequest: tool({
    description: 'Fallback tool when the request cannot be handled',
    inputSchema: z.object({
      reason: z.string().describe('Why the request could not be fulfilled'),
    }),
    execute: async ({ reason }) => {
      // Log or notify about unsupported request
      return {
        success: false,
        message: reason
      };
    },
  }),
}

router.get("/test", async (req, res) => {
  console.log("env", process.env.AI_MODEL);

  const { text } = await generateText({
    model: google(process.env.AI_MODEL || 'gemini-2.5-flash'),
    prompt: "What is love?"
  })

  res.json({ instances: text });
});

export default router;

