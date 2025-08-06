import auth from "@/lib/supabase/auth";
import { fetchFileBuffer, pdfJsonTest } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = auth(async (request, supabase) => {
  const { imageUrl, prompt } = await request.json();

  try {
    const {buffer, contentType} = await fetchFileBuffer(imageUrl);
    const pdf = await pdfJsonTest(buffer);

    let extractedText = "";

    // if (contentType.includes("png")) {
    //   console.log("passed gen pdf", contentType);
    //   // extractedText = await extractTextFromPDF(buffer);
    // } else if (contentType.includes("pdf") || contentType.includes("jpeg")) {
    //   // do extraction image
    // } else {
    //   return NextResponse.json({ error: "Unsupported file type" }, {status: 415});
    // }

    return NextResponse.json({message: "Success", data:{extractedText: pdf}});

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to extract text from file" }, {status: 500});
  }
});