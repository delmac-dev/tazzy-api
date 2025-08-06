import auth from "@/lib/supabase/auth";
import { prompt } from "@/requests/data";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const POST = auth(async (request, supabase) => {
  const { imageUrl, prompts } = await request.json();

  const ai = new GoogleGenAI({});
  try {
    const total_tokens = await ai.models.countTokens({
      model:"gemini-2.5-flash",
      contents: prompt
    }
)
    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-pro",
    //   contents: prompt
    // });
    return NextResponse.json(total_tokens);
  }catch(error:any) {
    return NextResponse.json({ error: "Generate Error", message: error.message }, {status: 500});
  }
});