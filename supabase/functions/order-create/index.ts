import { z } from "zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { requireUser } from "../_shared/utils/requireUser.ts";
import {
  cartTypeBackEndSchema,
  type Order,
  productBackEndSchema,
} from "@shared/types/Cart.ts";
import { type Database } from "@shared/types/database.ts";
import deliveryData from "@shared/data/shipping-options.json" with {
  type: "json",
};

import { estimatedDelivery } from "@shared/composables/useDeliveryEstimation.ts";

import {
  calculateProductsPrice,
  calculateTotalPrice,
} from "@shared/utils/Cart.ts";
import { numberWithTwoDecimals } from "@shared/utils/maths.ts";

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;

    // HTTP Method
    if (req.method !== "POST") return errorResponse("Method not allowed", 405);

    // User check
    let userId: string;
    let supaClient;
    try {
      const result = await requireUser(req);
      userId = result.user.id;
      supaClient = result.supabaseClient;
    } catch {
      return errorResponse("Unauthorized", 403);
    }

    // body check
    let body;
    try {
      const json = await req.json();
      body = cartTypeBackEndSchema.parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const messages = err.issues.map((e) =>
          `${e.path.join(".")}: ${e.message}`
        );
        return errorResponse(messages.join(" | "), 400);
      }
      return errorResponse("Invalid JSON body", 400);
    }

    const { payment_ID } = body;

    // Check if products exist and are not archived
    const productIds = body.products.map((p) => p.id);
    const { data: productsData } = await supaClient
      .from("products")
      .select(`id, price, archived, title, image, category, description`)
      .eq("archived", false)
      .in("id", productIds);

    if (!productsData || productsData.length !== productIds.length) {
      return errorResponse("Certains produits sont invalides", 400);
    }

    // check if delivery carrier exist
    const transporter = deliveryData.delivery_modes
      .flatMap((mode) => mode.transporters)
      .find((t) => t.id === body.delivery_carrier);

    if (!transporter) {
      throw new Error(`Transporteur introuvable: ${body.delivery_carrier}`);
    }

    // Check if payment intent exist
    if (!payment_ID) {
      throw new Error(`Identification du paiement introuvable`);
    }

    // Check if stock exist
    const { data: stocks } = await supaClient
      .from("product_stock")
      .select("product_id, quantity")
      .in("product_id", productIds);

    if (!stocks || stocks.length !== productIds.length) {
      return errorResponse("Stock introuvable pour certains produits", 400);
    }

    // normalize cart
    const cartProductsFromBody = body.products.map((item) => {
      const product = productsData.find((p) => p.id === item.id)!;
      const stock = stocks.find((s) => s.product_id === item.id)!;

      // check stock
      if (stock.quantity < item.quantity) {
        throw new Error(`Stock insuffisant pour le produit ${item.id}`);
      }

      return productBackEndSchema.parse({
        id: product.id,
        quantity: item.quantity,
        price: product.price,
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
      });
    });

    // Prices calculation
    const productsPrice = calculateProductsPrice(cartProductsFromBody);
    const totalPrice = calculateTotalPrice(cartProductsFromBody, {
      delivery_price: transporter.price,
    });

    // get estimated delivery date
    const isoDateStr = estimatedDelivery(
      new Date(),
      transporter.estimated_delivery_time,
    );
    if (!isoDateStr) {
      throw new Error("Date estimée de livraison introuvable");
    }
    const deliveryDate = new Date(isoDateStr);
    if (isNaN(deliveryDate.getTime())) {
      throw new Error("Date de livraison invalide");
    }
    const isoStringDateOnly = deliveryDate.toISOString().split("T")[0];

    // Cart insertion
    const { data: cart, error: cartError } = await supaClient
      .from("carts")
      .insert({
        user_id: userId,
      })
      .select("id")
      .single();

    if (cartError) throw cartError;

    // Products insertion
    const cartProducts = cartProductsFromBody.map((p) => {
      const { id, ...rest } = p;
      return {
        cart_id: cart.id,
        product_id: id,
        ...rest,
      };
    });

    const { data: productData, error: productsError } = await supaClient
      .from("carts_products")
      .insert(cartProducts)
      .select();

    if (productsError) throw productsError;

    // Order insertion
    const { data, error: errorOrder } = await supaClient
      .from("orders")
      .insert(
        {
          cart_id: cart.id,
          delivery_carrier: transporter.id,
          delivery_date: isoStringDateOnly,
          delivery_price: Number(numberWithTwoDecimals(transporter.price)),
          payment_method: "Carte bancaire",
          products_price: productsPrice,
          total_price: totalPrice,
          user_id: userId,
          payment_ID: payment_ID,
        } as Database["public"]["Tables"]["orders"]["Insert"],
      )
      .select("id")
      .single();

    if (errorOrder) return jsonResponse(errorOrder, 400);

    // Mapping result
    const order: Order = {
      id: data.id,
      user_id: userId,
      cart_id: cart.id,

      payment_status: "pending",
      payment_method: "Carte bancaire",
      payment_ID,

      stripe_event_id: null,

      created_at: new Date().toISOString(),

      total_price: Number(numberWithTwoDecimals(Number(totalPrice))),
      products_price: Number(numberWithTwoDecimals(Number(productsPrice))),

      delivery_price: Number(numberWithTwoDecimals(Number(transporter.price))),
      delivery_status: "processing",
      delivery_carrier: transporter.id,
      delivery_date: isoStringDateOnly,

      cart: {
        id: cart.id,
        products: cartProductsFromBody.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          description: item.description ?? "",
          image: item.image ?? "",
          category: item.category,
        })),
      },
    };
    return jsonResponse(JSON.stringify(order), 201);
  })
);
