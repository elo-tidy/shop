import type {
  ResolvePaymentIntentInput,
  ResolvePaymentIntentResponse,
} from "@/types/stripe";
import { supabase } from "@/utils/supabase";

export async function resolvePaymentIntent(
  payload: ResolvePaymentIntentInput,
): Promise<ResolvePaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke(
    "payment-resolve",
    {
      body: payload,
    },
  );
  if (error) {
    console.error("resolvePaymentIntent error:", error);
    throw new Error("Failed to resolve PaymentIntent");
  }
  return data as ResolvePaymentIntentResponse;
}
