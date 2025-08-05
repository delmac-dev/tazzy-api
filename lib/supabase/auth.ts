import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "./database";
import { IClient } from "../types";

type Handler = (req:NextRequest, supabase: IClient, context?:any) => Promise<Response>;

export default function auth(handler:Handler) {
    return async (request: NextRequest, context: any) => {
        const supabase = createServerClient<Database>(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            {
                cookies: { getAll: () => request.cookies.getAll() },
            }
        )
        // const { data: { user }, error } = await supabase.auth.getUser();

        // if (error || !user) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        return handler(request, supabase, context);
    }
}