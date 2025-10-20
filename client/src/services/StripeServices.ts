// Types
import type { ProductApi } from '@/types/Product'
import type { Stripe, StripeElements, StripeError } from '@stripe/stripe-js'
import type { PaymentIntentResponse, PaymentDetails } from '@/types/stripe'

// Return paymentIntents from backend
export async function fetchPaymentIntents(
  priceInCents: number,
  items: ProductApi[],
): Promise<PaymentIntentResponse> {
  const res = await fetch('/api/payment_intents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: priceInCents,
      items: items,
      currency: 'eur',
      payment_method_types: ['card'],
    }),
  })
  if (!res.ok) {
    throw new Error('Erreur lors de la création du PaymentIntent')
  }

  return await res.json()
}

// Return confirm payment
export async function getConfirmedPayment(
  stripeInstance: Stripe,
  elements: StripeElements,
  clientSecret: string | null,
  return_url: string,
): Promise<{ error?: StripeError }> {
  if (!clientSecret) {
    throw new Error('Le clientSecret est requis pour confirmer le paiement.')
  }
  const { error } = await stripeInstance.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: return_url,
      payment_method_data: {
        billing_details: {
          address: {
            country: 'FR',
          },
        },
      },
    },
  })

  return { error }
}

// Fetch payment details
export async function fetchPaymentDetails(payment_intent: string): Promise<PaymentDetails> {
  const res = await fetch(`/api/payment_intents/${payment_intent}`)
  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`)
  }
  return await res.json()
}
