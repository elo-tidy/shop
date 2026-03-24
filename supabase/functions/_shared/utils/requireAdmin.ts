import { getSupabaseClient } from "../utils/supabase.ts";
import { requireUser } from "./requireUser.ts";

export async function requireAdmin(req: Request) {
  const user = await requireUser(req);
  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return { user, supabaseClient };
}