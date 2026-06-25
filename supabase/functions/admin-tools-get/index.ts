import { z } from "zod";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { requireAdmin } from "../_shared/utils/requireAdmin.ts";

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;

    // HTTP Method
    if (req.method !== "GET") {
      return errorResponse("Method not allowed", 405);
    }

    // Check if admin user - get supabase client
    let supabaseClient;
    try {
      const result = await requireAdmin(req);
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    return jsonResponse(true, 200);
  })
);
