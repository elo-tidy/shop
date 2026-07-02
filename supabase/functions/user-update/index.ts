import { z } from "zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { requireUser } from "../_shared/utils/requireUser.ts";
import { type User, UserSchema } from "@shared/types/User.ts";

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;

    // HTTP Method
    if (req.method !== "PATCH") return errorResponse("Method not allowed", 405);

    // User check
    let userId;
    let supaClient;
    try {
      const result = await requireUser(req);
      userId = result.user.id;
      supaClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    // Body check
    let body: { username: string };
    try {
      const json = await req.json();
      body = UserSchema.pick({ username: true }).parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Erreur Zod
        const messages = err.errors.map((e) =>
          `${e.path.join(".")}: ${e.message}`
        );
        return errorResponse(messages.join(" | "), 400);
      }
      return errorResponse("Invalid JSON body", 400);
    }

    const { username } = body;

    // User update
    const { data, error } = await supaClient
      .from("profiles")
      .update({ username })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return jsonResponse({ error: error.message }, 400);
    }

    return jsonResponse({
      message: "Nom d'utilisateur modifié avec succès",
      data,
    });
  })
);
