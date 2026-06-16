
import { supabase } from '@/utils/supabase'

type ResolvePaymentIntentInput = {
  orderId: string
  amount: number
  currency: string
  paymentIntentId?: string
  metadata?: Record<string, string>
}

type ResolvePaymentIntentResponse = {
  clientSecret: string
  paymentIntentId: string
}

export async function resolvePaymentIntent(
  payload: ResolvePaymentIntentInput,
): Promise<ResolvePaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke(
    'payment-resolve',
    {
      body: payload,
    },
  )
  if (error) {
    console.error('resolvePaymentIntent error:', error)
    throw new Error('Failed to resolve PaymentIntent')
  }
  return data as ResolvePaymentIntentResponse
}