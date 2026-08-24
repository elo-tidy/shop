export const allowedOrigins = [
  "https://fictive-shop.vercel.app",
  "http://localhost:5173",
];

export const defaultCorsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";

  return {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "",
  };
}
