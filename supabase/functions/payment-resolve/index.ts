import { z } from "npm:zod";
import Stripe from "npm:stripe@14.0.0";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";

const schema = z.object({
  orderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  paymentIntentId: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors instanceof Response) return cors;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch (e) {
    return errorResponse("Invalid body", 400);
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return errorResponse("Missing Stripe key", 500);
  }

  const stripe = new Stripe(stripeKey);

  try {
    let paymentIntent: Stripe.PaymentIntent | null = null;

    
    if (body.paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(
          body.paymentIntentId,
        );
      } catch {
        paymentIntent = null;
      }
    }

    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: body.amount,
        currency: body.currency,
        payment_method_types: ["card"],
        metadata: {
          ...body.metadata,
          orderId: body.orderId,
        },
      });

    } 

    return jsonResponse(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      200,
    );
  } catch (err) {
    console.error("Stripe error:", err);
    return errorResponse("Stripe failure", 500);
  }
});