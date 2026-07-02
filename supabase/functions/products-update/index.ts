import { z } from "zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { requireAdmin } from "../_shared/utils/requireAdmin.ts";
import { type productForm, productFormSchema } from "@shared/types/Product.ts";
import { categoryEnum } from "@shared/types/Categories.ts";
import type { Database, Tables } from "@shared/types/database.ts";

type ProductUpdateResponse = Tables<"products"> & {
  stock: number;
};

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;

    // HTTP Method
    if (req.method !== "PATCH") return errorResponse("Method not allowed", 405);

    // admin check + supabase client
    let supabaseClient;
    try {
      const result = await requireAdmin(req);
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    // Body check
    let body: productForm;
    try {
      const json = await req.json();
      body = productFormSchema.parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        const flattened = err.flatten().fieldErrors;
        for (const key in flattened) {
          const msgs = flattened[key];
          if (msgs && msgs.length > 0) {
            if (key === "category") {
              errors[key] = `Invalid option: expected one of '${
                categoryEnum.options.join(" | ")
              }'`;
            } else {
              errors[key] = msgs[0]!;
            }
          }
        }
        return errorResponse(JSON.stringify(errors), 400);
      }
      return errorResponse("Erreur de validation inconnue", 400);
    }

    if (!body.id) {
      return errorResponse("L'id du produit est obligatoire", 400);
    }

    // isolate modifiable data
    const { id, stock, ...updatableData } = body;

    // check if product exist
    const { data: productData, error: productError } = await supabaseClient
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    // .single();

    if (productError) return errorResponse(productError.message, 400);
    if (!productData) {
      return errorResponse("Produit introuvable", 404);
    }

    // Product update
    const { data: updateProductData, error: updateProductError } =
      await supabaseClient
        .from("products")
        .update(updatableData)
        .eq("id", id)
        .select()
        .single();

    if (updateProductError) {
      return jsonResponse({ updateProductError }, 400);
    }
    // return jsonResponse({ message: "Produit modifié avec succès", updateProductData });

    // Stock update
    const { data: stockData, error: stockError } = await supabaseClient
      .from("product_stock")
      .update({ quantity: body.stock })
      .eq("product_id", body.id)
      .select()
      .single();

    if (stockError) return jsonResponse({ stockError }, 400);

    const { quantity, ...rest } = stockData;

    const data: ProductUpdateResponse = {
      ...updateProductData,
      stock: quantity ?? 0,
    };

    return jsonResponse({ message: "Produit modifié avec succès", data });
  })
);
