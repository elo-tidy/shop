import Stripe from "stripe";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { ResolvePaymentIntentInputSchema } from "@shared/types/stripe.ts";

Deno.serve(async (req) => {
  const corsResult = handleCors(req);
  if (corsResult instanceof Response) return corsResult;

  if (req.method === "OPTIONS") {
    return jsonResponse(null, 204);
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  let body;
  try {
    body = ResolvePaymentIntentInputSchema.parse(await req.json());
  } catch (e) {
    return errorResponse("Invalid body", 400);
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return errorResponse("Missing Stripe key", 500);
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

  const createPi = () => {
    return stripe.paymentIntents.create({
      amount: body.amount,
      currency: body.currency,
      payment_method_types: ["card"],
      metadata: {
        orderId: body.metadata.orderId,
        cartId: body.metadata.cartId,
        userId: body.metadata.userId,
      },
    });
  };

  const updatePi = (
    piId: Stripe.PaymentIntent["id"],
    metadataOnly: string | null,
  ) => {
    if (metadataOnly === "metadataOnly") {
      return stripe.paymentIntents.update(
        piId,
        {
          metadata: {
            orderId: body.metadata.orderId,
            cartId: body.metadata.cartId,
            userId: body.metadata.userId,
          },
        },
      );
    }

    return stripe.paymentIntents.update(
      piId,
      {
        amount: body.amount,
        currency: body.currency,
        payment_method_types: ["card"],
        metadata: {
          orderId: body.metadata.orderId,
          cartId: body.metadata.cartId,
          userId: body.metadata.userId,
        },
      },
    );
  };

  try {
    let paymentIntent: Stripe.PaymentIntent | null = null;
    const paymentIntentId = body.paymentIntentId;

    // if no pi, create
    if (!paymentIntentId) {
      paymentIntent = await createPi();
    } else {
      // if existing pi, retrieve
      let pi: Stripe.PaymentIntent | null = null;

      try {
        pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      } catch (err) {
        console.error("Invalid PaymentIntent ID:", paymentIntentId, err);
        pi = null;
      }

      // fallback if PI not found
      if (!pi) {
        paymentIntent = await createPi();
      } else if (pi.status === "succeeded") {
        // already paid, metadata only
        paymentIntent = await updatePi(pi.id, "metadataOnly");
      } else {
        // update PI
        paymentIntent = await updatePi(pi.id, null);
      }
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
