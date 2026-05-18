import { z } from "npm:zod";
import { AuthMiddleware } from "../_shared/jwt/default.ts";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";
import { requireUser } from "../_shared/utils/requireUser.ts";
import { type CartProduct, cartTypeSchema, cartTypeBackEndSchema, productBackEndSchema } from "../types/Cart.ts"; 

import deliveryData from '../data/shipping-options.json' assert { type: 'json' };

import {estimatedDelivery} from "../utils/useDeliveryEstimation.ts";

import {
  calculateProductsPrice,
  calculateTotalPrice
} from "../utils/Cart.ts";


Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    
    // CORS
    const corsResult = handleCors(req);
    if (corsResult instanceof Response) return corsResult;
    const headers = corsResult;

    // Méthode HTTP
    if (req.method !== "POST") return errorResponse("Method not allowed", 405);

    // Vérification user
    let userId: string;
    let supaClient;
    try {
      const result = await requireUser(req);
      userId = result.user.id;
      supaClient = result.supabaseClient;      
    } catch {
      return errorResponse("Unauthorized", 403);
    }


    // validation body
    let body;
    try {
      const json = await req.json();
      body = cartTypeBackEndSchema.parse(json);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const messages = err.issues.map(e => `${e.path.join('.')}: ${e.message}`);
        return errorResponse(messages.join(" | "), 400);
      }
      return errorResponse("Invalid JSON body", 400);
    }
    
    const { products, delivery_carrier_id, payment_intent_ID } = body;

    // vérification que les produits existent et ne sont pas archivés
    const productIds = body.products.map(p => p.id);
    const { data: productsData } = await supaClient
      .from("products")
      .select(`id, price, archived, title, image, category, description`)
      .eq("archived", false)
      .in("id", productIds);

    if (!productsData || productsData.length !== productIds.length) {
      return errorResponse("Certains produits sont invalides", 400);
    }

    // Vérification du transporteur
    const transporter = deliveryData.delivery_modes
      .flatMap(mode => mode.transporters)
      .find(t => t.id === body.delivery_carrier_id);

    if (!transporter) {
      throw new Error(`Transporteur introuvable: ${body.delivery_carrier_id}`);
    }

    // Vérification du paymentIntent
    if (!payment_intent_ID) {
      throw new Error(`Identification du paiement introuvable`);
    }

    // vérification stock
    const { data: stocks } = await supaClient
      .from("product_stock")
      .select("product_id, quantity")
      .in("product_id", productIds);

    if (!stocks || stocks.length !== productIds.length) {
      return errorResponse("Stock introuvable pour certains produits", 400);
    }    

    // Normalisation du panier pour insertion + check stock
    const cartProductsFromBody: CartProduct[] = body.products.map(item => {

      const product = productsData.find(p => p.id === item.id)!;
      const stock = stocks.find(s => s.product_id === item.id)!;

      console.log('product', product);

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
        description: product.description
      });
    });

    // calculs de prix
    const productsPrice = calculateProductsPrice(cartProductsFromBody);
    const totalPrice = calculateTotalPrice(cartProductsFromBody, {
      delivery_price: transporter.price,
    });

    // Recherche de la date de livraison estimée
    const isoDateStr = estimatedDelivery(transporter.estimated_delivery_time);
    const deliveryDate = new Date(isoDateStr);
    if (isNaN(deliveryDate.getTime())) {
      throw new Error("Date de livraison invalide");
    }
    const isoStringDateOnly = deliveryDate.toISOString().split("T")[0];

    // Insertion du cart
    const { data: cart, error: cartError } = await supaClient
      .from("carts")
      .insert({
        user_id: userId,
      })
      .select("id")
      .single();

    if (cartError) throw cartError;

    // Insertion des produits du cart
    const cartProducts : CartProduct[] = cartProductsFromBody.map(p => {
      const { id, ...rest } = p;
      return {
        cart_id: cart.id,
        product_id: id,
        ...rest
      };
    });
    console.log("cartProducts", cartProducts);
    console.log(JSON.stringify(cartProducts, null, 2));

    const {data:productData, error: productsError } = await supaClient
      .from("carts_products")
      .insert(cartProducts)
      .select();

    if (productsError) throw productsError;


    // insertion de la commande
    const { data, error: errorOrder } = await supaClient
      .from("orders")
      .insert({
        cart_id: cart.id,
        delivery_carrier: transporter.id,
        delivery_date: isoStringDateOnly,
        delivery_price: transporter.price,
        payment_method: "Carte bancaire",
        products_price: productsPrice,
        total_price: totalPrice,
        user_id: userId,
        payment_ID: payment_intent_ID,
      } as Database["public"]["Tables"]["orders"]["Insert"])
      .select("id")
      .single();

    if (errorOrder) return jsonResponse({ errorOrder }, 400);

    return new Response(JSON.stringify({ data }), { status: 201, headers });
   
  })
);