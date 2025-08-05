import auth from "@/lib/supabase/auth";
import { NextResponse } from "next/server";

export const POST = auth(async (req, supabase, context) => {

  return NextResponse.json({ message: 'Authenticated' });
});