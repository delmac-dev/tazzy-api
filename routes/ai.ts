import { Router } from "express";
import { google } from '@ai-sdk/google';
import { generateText } from "ai";

const router = Router();

router.get("/", async (req, res) => {
  console.log("env", process.env.AI_MODEL);

  const { text } = await generateText({
    model: google(process.env.AI_MODEL || 'gemini-2.5-flash'),
    prompt: "what is the full name of AI?"
  })

  res.json({ instances: text });
});

export default router;