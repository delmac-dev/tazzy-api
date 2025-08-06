import { GoogleGenAI, Type } from "@google/genai";
import axios from "axios";
import { type Request, type Response, Router } from "express";

const router = Router();

router.post("/generate", async (req: Request, res: Response) => {
  // const { id } = req.params;
  const { prompt, url } = req.body;
  const ai = new GoogleGenAI({});
  const fileUrl = url??"";

  if (!prompt) {
    return res.status(400).json({
      error: "Bad Request",
      message: "'prompt' field is required."
    });
  };

  // const fileBuffer = !fileUrl ? null : await axios.get(fileUrl, {
  //   responseType: "arraybuffer"
  // });

  // const contents = [
  //   { text: prompt },
  //   {
  //     inlineData: {
  //       data: Buffer.from(fileBuffer?.data).toString("base64")
  //     }
  //   }
  // ];

  // const response = await ai.models.generateContent({
  //     model: "gemini-2.5-flash",
  //     contents: contents
  // });

  res.json({ prompt, fileUrl });
});

router.get("/test", async (req, res) => {

  res.json({ message: "All Todos" });
});

export default router;