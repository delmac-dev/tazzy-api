import { createClient as newClient } from "@supabase/supabase-js";
import { Database } from "../../types/database";

export function client(jwt: string) {
  return newClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    }
  );
};