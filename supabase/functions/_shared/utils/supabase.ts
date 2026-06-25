import { createClient } from "npm:@supabase/supabase-js@2.58.0";

export function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
