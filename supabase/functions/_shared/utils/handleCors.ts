import { getCorsHeaders } from "./cors.ts";

export function handleCors(req: Request) {
  const headers = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  return headers;
}
