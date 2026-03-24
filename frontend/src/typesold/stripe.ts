export type PaymentIntentResponse = {
  clientSecret: string
  paymentIntentId: string
}
export type PaymentDetails = {
  id: string
  object: 'payment_intent'
  amount: number
  currency: string
  created: number
  payment_method_types: string[]
  status: string
  client_secret: string
}
