// Types
import type {ProductApi} from "../../client/src/types/Product";
import type {CartType, Order, Cart} from "../../client/src/types/Cart";
import type {
	Stripe,
	StripeElements,
	StripeError,
} from "../../client/node_modules/@stripe/stripe-js";
import type {
	PaymentIntentResponse,
	PaymentDetails,
} from "../../client/src/types/stripe";

// Return paymentIntents from backend
export async function fetchPaymentIntents(
	priceInCents: number,
	// items: CartType["products"],
	orderId: Order["id"],
	userId: CartType["user_id"],
	cartId: Cart["id"]
	// orderId: Order["id"]
): Promise<PaymentIntentResponse> {
	const res = await fetch("http://localhost:3000/api/payment_intents", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: priceInCents,
			currency: "eur",
			// items: items,
			metadata: {
				orderId: orderId,
				userId: userId,
				cartId: cartId,
			},
		}),
	});
	if (!res.ok) {
		throw new Error("Erreur lors de la création du PaymentIntent");
	}
	const data = await res.json();
	console.log("fetchPaymentIntents response:", data);
	return data;
	// return await res.json();
}

// Return confirm payment
export async function getConfirmedPayment(
	stripeInstance: Stripe,
	elements: StripeElements,
	clientSecret: string | null,
	return_url: string
): Promise<{error?: StripeError}> {
	if (!clientSecret) {
		throw new Error(
			"Le clientSecret est requis pour confirmer le paiement."
		);
	}
	const {error} = await stripeInstance.confirmPayment({
		elements,
		clientSecret,
		confirmParams: {
			return_url: return_url,
			payment_method_data: {
				billing_details: {
					address: {
						country: "FR",
					},
				},
			},
		},
	});

	return {error};
}

// Fetch payment details
export async function fetchPaymentDetails(
	payment_intent: string
): Promise<PaymentDetails> {
	const res = await fetch(`/api/payment_intents/${payment_intent}`);
	if (!res.ok) {
		throw new Error(`Erreur HTTP ${res.status}`);
	}
	return await res.json();
}
