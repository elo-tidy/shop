export const allowedOrigin = Deno.env.get("CORS_ALLOWED_ORIGINS");
if (!allowedOrigin) {
  throw new Error("CORS_ALLOWED_ORIGINS is not configured");
}

export const defaultCorsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";

  return {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : "",
  };
}
