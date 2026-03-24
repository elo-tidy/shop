import { defaultCorsHeaders } from "./cors.ts";

export const jsonHeaders = {
  ...defaultCorsHeaders,
  "Content-Type": "application/json",
};

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

export function errorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: jsonHeaders,
  });
}