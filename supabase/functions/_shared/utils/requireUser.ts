import { getUserFromToken } from "../jwt/getUser.ts";

export async function requireUser(req: Request) {
  const user = await getUserFromToken(
    req.headers.get("Authorization") || undefined
  );

  return user;
}
