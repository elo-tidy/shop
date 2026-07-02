import { getUserFromToken } from "../jwt/getUser.ts";
import { getSupabaseClient } from "../utils/supabase.ts";

export async function requireUser(req: Request) {
  const token = req.headers.get("Authorization") || undefined;
  const user = await getUserFromToken(token);

  if (!user) throw new Error("Unauthorized");
  const supabaseClient = getSupabaseClient();

  return { user, supabaseClient };
}
