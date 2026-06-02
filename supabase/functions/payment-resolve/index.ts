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

  const createPi = async() => {
    return stripe.paymentIntents.create({
      amount: body.amount,
      currency: body.currency,
      payment_method_types: ["card"]
    });
  }

  const updatePi = async(piId:Stripe.PaymentIntent["id"], metadataOnly:string | null) => {

    if (metadataOnly === "metadataOnly") {
      return stripe.paymentIntents.update(piId, {
        metadata: body.metadata,
      });
    }

    return stripe.paymentIntents.update(piId, {
      amount: body.amount,
      currency: body.currency,
      payment_method_types: ["card"],      
      metadata: body.metadata,
    });
  }

  try {
    let paymentIntent: Stripe.PaymentIntent | null = null

    const paymentIntentId = body.paymentIntentId

    console.log("update payment intent", body)

    // Si pas de pi, on en crée un
    if (!paymentIntentId) {
      paymentIntent = await createPi()
    } else {

      // sinon on le récupère et on maj
      let pi: Stripe.PaymentIntent | null = null

      try {
        pi = await stripe.paymentIntents.retrieve(paymentIntentId)
      } catch (err) {
        console.error("Invalid PaymentIntent ID:", paymentIntentId, err)
        pi = null
      }

      // fallback si PI introuvable
      if (!pi) {
        paymentIntent = await createPi()
      } else if (pi.status === "succeeded") {
        // PI déjà payé → metadata only
        paymentIntent = await updatePi(pi.id, "metadataOnly")
        console.log("PI modifiée après paiement")
      } else {
        // PI modifiable
        paymentIntent = await updatePi(pi.id)
        console.log("PI modifiée avant")
      }
    }

    return jsonResponse(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      200,
    )

  } catch (err) {
    console.error("Stripe error:", err)
    return errorResponse("Stripe failure", 500)
  }
});