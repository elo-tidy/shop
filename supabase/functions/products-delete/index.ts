import { z } from "npm:zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";
import { requireAdmin } from "../_shared/utils/requireAdmin.ts";
import {productDeleteSchema, type productDelete} from '../types/Product.ts'

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {

    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;
    const headers = corsResult;

    // Méthode HTTP
    if (req.method !== "DELETE") return errorResponse("Method not allowed", 405);

    // Vérification admin + Supabase client
    let supabaseClient;
    try {
      const result = await requireAdmin(req);
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }
    
    // Validation body
    const url = new URL(req.url);
    const productId = Number(url.searchParams.get("id"));
    if (!productId) return errorResponse("L'id du produit est obligatoire", 400);
    
    let validatedId: number;
    try {
      validatedId = productDeleteSchema.parse({ id: productId }).id;        
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Erreur Zod
        const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return errorResponse(messages.join(" | "), 400);
      }
      return errorResponse("Invalid JSON body", 400);
    } 

    // On vérifie si le produit existe
    const { data: productData, error: productError } = await supabaseClient
      .from("products")
      .select()
      .eq("id", validatedId);

    if (productError) return errorResponse(productError.message, 400);
    if (!productData || productData.length === 0) return errorResponse("Produit introuvable", 404);

    // Présence de cascade
    const { data: cascadeData, error: cascadeError } = await supabaseClient
      .from("carts_products")
      .select()
      .eq("product_id", validatedId);

    if (cascadeError) return errorResponse(cascadeError.message, 400);

    // Si cascade, on arhive
    if (cascadeData && cascadeData.length > 0) {
      const { data: archivedData, error: archivedError } = await supabaseClient
        .from("products")
        .update({ archived: true })
        .eq("id", validatedId)
        .select();

      if (archivedError) return errorResponse(archivedError.message, 400);
      return jsonResponse({ message: "Produit archivé car utilisé dans un panier", data: archivedData });
    }

    // On supprime les stocks avant le produit
    const { data: stockData, error: stockError } = await supabaseClient
      .from("product_stock")
      .delete()
      .eq("product_id", validatedId)
      .select();
    
    if (stockError) return errorResponse(stockError.message, 400);      

    // si aucune cascade, on supprime le produit
    const { data: deletedData, error: deletedError } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", validatedId)
      .select()
      .single();

    if (deletedError) return errorResponse(deletedError.message, 400);     

    const data = {...deletedData, stock : stockData[0].quantity}

    return jsonResponse({ message: "Produit supprimé avec succès", data });
  })
);