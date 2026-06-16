export interface ResolvePaymentIntentInput {
  orderId: string;
  amount: number;
  currency: string;
  paymentIntentId?: string;
  metadata?: Record<string, string>;
}

export interface ResolvePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}
