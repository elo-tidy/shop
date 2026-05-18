import { z } from "npm:zod";
import Stripe from "npm:stripe@14.0.0";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";

const retrievePaymentIntentSchema = z.object({
  payment_intent: z.string().min(1, "Payment intent ID is required"),
});

type RetrievePaymentIntentPayload = z.infer<typeof retrievePaymentIntentSchema>;

Deno.serve(async (req) => {
  const corsResult = handleCors(req);
  if (corsResult instanceof Response) return corsResult;
  const headers = corsResult;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  // Validation body
  let body: RetrievePaymentIntentPayload;
  try {
    const json = await req.json();
    body = retrievePaymentIntentSchema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return errorResponse(messages.join(' | '), 400);
    }
    return errorResponse("Invalid JSON body", 400);
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return errorResponse("Stripe secret key is not configured", 500);
    }

    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.retrieve(body.payment_intent);

    return jsonResponse(paymentIntent, 200);
  } catch (error) {
    console.error("Stripe payment intent retrieval failed:", error);
    return errorResponse("Failed to retrieve Stripe PaymentIntent", 500);
  }
});
