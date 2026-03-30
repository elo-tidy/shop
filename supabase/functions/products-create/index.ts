import { z } from "npm:zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";
import { requireAdmin } from "../_shared/utils/requireAdmin.ts";
import { productAddSchema, type productAdd } from "../types/Product.ts"; 


Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;
    const headers = corsResult;

    // Méthode HTTP
    if (req.method !== "POST") return errorResponse("Method not allowed", 405);

    // Vérification admin + Supabase client
    let supabaseClient;
    try {
      const result = await requireAdmin(req);
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    // Validation body
    let body:productAdd;
    try {
      const json = await req.json();
      body = productAddSchema.parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Erreur Zod
        const messages = err.issues.map(e => `${e.path.join('.')}: ${e.message}`);
        return errorResponse(messages.join(" | "), 400);
      }
      return errorResponse("Invalid JSON body", 400);
    } 

    const {stock,...rest} = body

    // Insertion du produit    
    const { data : newProductData, error: newroductError } = await supabaseClient
      .from("products")
      .insert(rest)
      .select()
      .single();

    if (newroductError) return jsonResponse({ newroductError }, 400);

    // Insertion du stock
    console.log("product_id", newProductData.id)
    const { data:stockData , error:stockError } = await supabaseClient
      .from("product_stock")
      .insert({
        product_id: newProductData.id,
        quantity: stock
      });    
      
    if (stockError) return jsonResponse({ stockError }, 400);

    const data = {...newProductData, stock: stock}
    console.log("data", data)

    // Réponse
    return new Response(JSON.stringify({ data }), { status: 201, headers });
  })
);