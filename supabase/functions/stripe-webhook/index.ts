import Stripe from "stripe";
import { handleCors } from "../_shared/utils/handleCors.ts";
import { errorResponse, jsonResponse } from "../_shared/utils/response.ts";
import { getSupabaseClient } from "../_shared/utils/supabase.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors instanceof Response) return cors;

  // Only POST for webhooks
  if (req.method === "OPTIONS") {
    return jsonResponse(null, 204);
  }
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!webhookSecret || !stripeKey) {
    console.error("Missing Stripe env vars");
    return errorResponse("Missing Stripe configuration", 500);
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  // Get raw body
  const buf = await req.arrayBuffer();
  const payload = new TextDecoder().decode(buf);
  const sig = req.headers.get("stripe-signature") ?? "";

  // Check stripe signature
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      sig,
      webhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return errorResponse("Webhook signature verification failed", 400);
  }

  const supabase = getSupabaseClient();

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const paymentIntentId = paymentIntent.id;
  const stripeEventId = event.id;
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("Missing orderId in metadata");
    return jsonResponse(JSON.stringify({ received: true }), 200);
  }

  // bdd pending order data
  const updateBddOrder = async (paymentStatus: "failed") => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        stripe_event_id: stripeEventId,
      })
      .eq("payment_ID", paymentIntentId)
      .eq("id", orderId)
      .in("payment_status", ["pending", "failed"])
      .select()
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return errorResponse("DB error", 500);
    }

    if (!data) {
      console.warn("[WEBHOOK NO-OP] already processed or not found", {
        stripeEventId,
        paymentIntentId,
        orderId,
      });

      return jsonResponse(JSON.stringify({ received: true, noop: true }), 200);
    }
    return data;
  };

  try {
    // Handle common events - update order payment status when appropriate
    switch (event.type) {
      case "payment_intent.succeeded": {
        const { data: data, error } = await supabase.rpc(
          "process_paid_order",
          {
            p_order_id: orderId,
            p_payment_intent_id: paymentIntentId,
            p_stripe_event_id: stripeEventId,
          },
        );

        if (error) {
          console.error("PROCESS ORDER ERROR:", error);
          return errorResponse("Failed processing order", 500);
        }

        break;
      }
      case "payment_intent.payment_failed": {
        await updateBddOrder("failed");
        break;
      }
      default:
        console.log("Unhandled event:", event.type);
    }

    return jsonResponse(JSON.stringify({ received: true }), 200);
  } catch (err) {
    console.error("Error handling webhook event:", err);
    return errorResponse("Internal error", 500);
  }
});
