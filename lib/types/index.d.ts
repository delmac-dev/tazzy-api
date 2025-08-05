import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase/database";


export type IClient = SupabaseClient<Database>;