import { allowedOrigins, defaultCorsHeaders } from "./cors.ts";
import { jsonHeaders } from "./response.ts";

export function handleCors(req: Request) {

    const origin = req.headers.get("origin") ?? ""; // req origin
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : ""; // use req origin if allowed, else empty

    const headers = {
        ...defaultCorsHeaders,
        "Access-Control-Allow-Origin": allowedOrigin,
        "Content-Type": "application/json",
    };

    if (req.method === "OPTIONS") {
        return new Response(null, {
        status: 204, // No Content
        headers,
        });
    }

    return headers;
}