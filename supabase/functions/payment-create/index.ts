import { z } from "npm:zod";
import Stripe from "npm:stripe@14.0.0";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { jsonResponse, errorResponse } from "../_shared/utils/response.ts";

const createPaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
});

type CreatePaymentIntentPayload =
  z.infer<typeof createPaymentIntentSchema>;

Deno.serve(async (req) => {
  
  const corsResult = handleCors(req);
  if (corsResult instanceof Response) return corsResult;
  const headers = corsResult;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

    // Validation body
    let body: CreatePaymentIntentPayload;
    try {
      const json = await req.json();
      body = createPaymentIntentSchema.parse(json);
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

      const paymentIntent = await stripe.paymentIntents.create({
        amount: body.amount,
        currency: body.currency,
        payment_method_types: ["card"],
        metadata: body.metadata,
      });

      return jsonResponse(
        {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
        200,
      );
    } catch (error) {
      console.error("Stripe payment intent creation failed:", error);
      return errorResponse("Failed to create Stripe PaymentIntent", 500);
    }
});