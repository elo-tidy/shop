import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { requireUser } from "../_shared/utils/requireUser.ts";

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;

    // HTTP Method
    if (req.method !== "DELETE") {
      return errorResponse("Method not allowed", corsResult, 405);
    }

    // User check
    let userId: string;
    let supabaseClient;

    try {
      const result = await requireUser(req);
      userId = result.user.id;
      supabaseClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", corsResult, 403);
    }

    // Body check
    const url = new URL(req.url);
    const orderId = url.searchParams.get("id");

    if (!orderId) {
      return errorResponse(
        "L'id de la commande est obligatoire",
        corsResult,
        400,
      );
    }

    // Check if order exist with that user
    const { data: orderData, error: orderError } = await supabaseClient
      .from("orders")
      .select("id, cart_id")
      .eq("id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (orderError) {
      return errorResponse(orderError.message, corsResult, 400);
    }

    if (!orderData) {
      return errorResponse("Commande introuvable", corsResult, 404);
    }

    // Delete all products from current cart
    const { error: productsError } = await supabaseClient
      .from("carts_products")
      .delete()
      .eq("cart_id", orderData.cart_id);

    if (productsError) {
      return errorResponse(productsError.message, corsResult, 400);
    }

    // Delete order
    const { error: orderDeleteError } = await supabaseClient
      .from("orders")
      .delete()
      .eq("id", orderData.id);

    if (orderDeleteError) {
      return errorResponse(orderDeleteError.message, corsResult, 400);
    }

    // Delete cart
    const { data: cartData, error: cartError } = await supabaseClient
      .from("carts")
      .delete()
      .eq("id", orderData.cart_id)
      .select()
      .single();

    if (cartError) {
      return errorResponse(cartError.message, corsResult, 400);
    }

    return jsonResponse(
      {
        message: "Commande supprimée avec succès",
        data: cartData.id,
      },
      corsResult,
      200,
    );
  })
);
