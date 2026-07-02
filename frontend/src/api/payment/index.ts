import type {
  ResolvePaymentIntentInput,
  ResolvePaymentIntentResponse,
} from "@shared/types/stripe";
import { supabase } from "@/utils/supabase";

export async function resolvePaymentIntent(
  payload: ResolvePaymentIntentInput,
): Promise<ResolvePaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke<
    ResolvePaymentIntentResponse
  >(
    "payment-resolve",
    {
      body: payload,
    },
  );
  if (error) {
    console.error("resolvePaymentIntent error:", error);
    throw new Error("Failed to resolve PaymentIntent");
  }
  if (!data) {
    throw new Error("No data returned");
  }
  return data;
}
