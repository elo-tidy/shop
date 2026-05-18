import type { PaymentIntentResponse } from '@/types/stripe'
import type { PaymentDetails } from '@/types/stripe'
import { supabase } from '@/utils/supabase'

export type CreatePaymentIntentPayload = {
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
): Promise<PaymentIntentResponse> {
    console.log('payload api', payload)
  const { data, error } = await supabase.functions.invoke('payment-create', {
    method: 'POST',
    body: payload,
  })

  console.log('api createPaymentIntent', data)

  if (error) {
    throw error
  }

  return data as PaymentIntentResponse
}

export async function fetchPaymentDetails(
  paymentIntentId: string,
): Promise<PaymentDetails> {
  const { data, error } = await supabase.functions.invoke('payment-retrieve', {
    method: 'POST',
    body: { payment_intent: paymentIntentId },
  })

  if (error) {
    throw error
  }

  return data as PaymentDetails
}
