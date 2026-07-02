import { getUserFromToken } from "../jwt/getUser.ts";
import { getSupabaseClient } from "../utils/supabase.ts";

export async function requireUser(req: Request) {
  const token = req.headers.get("Authorization") || undefined;
  const user = await getUserFromToken(token);

  if (!user) throw new Error("Unauthorized");
  const supabaseClient = getSupabaseClient();

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("active", true)
    .single();

  if (error || !data) {
    throw new Error("User not found or inactive");
  }

  return { user: data, supabaseClient };
}
