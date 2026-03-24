import { z } from "npm:zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";
import { requireAdmin } from "../_shared/utils/requireAdmin.ts";
import { productAddSchema, type productAdd } from "../types/Product.ts"; 

// Schema Zod
const categories = ["electronics", "jewelery", "mens clothing", "womens clothing"] as const;


Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {

    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;
    const headers = corsResult;

    // Méthode HTTP
    if (req.method !== "PATCH") return errorResponse("Method not allowed", 405);

    // Vérification admin + Supabase client
    let supabaseClient;
    try {
      const result = await requireAdmin(req);
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    // Validation body
    let body;
    try {
      const json = await req.json();     
      body = productAddSchema.parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        const flattened = err.flatten().fieldErrors;
        for (const key in flattened) {
          const msgs = flattened[key];
          if (msgs && msgs.length > 0) {
            if (key === "category") {
              errors[key] = `Invalid option: expected one of '${categories.join(" | ")}'`;
            } else {
              errors[key] = msgs[0]!;
            }
          }
        }
        return errorResponse(errors, 400);
      }
      return errorResponse("Erreur de validation inconnue", 400);  
    } 

    // Vérification que le produit existe
    const { data: productData, error: productError } = await supabaseClient
      .from("products")
      .select()
      .eq("id", body.id)
      // .single();

    if (productError) return errorResponse(productError.message, 400);
    if (productData.length === 0) return errorResponse("Produit introuvable", 404);

    // Isoler les data modifiables
    const {id, ...updatableData} = body     

    // Modification du produit
    const { data, error } = await supabaseClient
      .from("products")
      .update(updatableData)
      .eq("id", body.id)
      .select();

    if (error) return jsonResponse({ error }, 400);
    return jsonResponse({ message: "Produit modifié avec succès", data });
  })
);