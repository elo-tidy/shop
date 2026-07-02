import { ref } from "vue";
import { useRoute } from "vue-router";
// Types
import type { cartProduct, CartType } from "@shared/types/Cart";
import type { Order } from "@shared/types/Order";
import type { Transporter } from "@shared/types/ShippingMode";
import type {
  ResolvePaymentIntentInput,
  ResolvePaymentIntentResponse,
} from "@shared/types/stripe";
import type { PaymentIntentResult } from "@stripe/stripe-js";
// Stores
import { useCartStore } from "@/store/CartStore";
import { useOrderStore } from "@/store/OrderStore";
import { usePaymentStore } from "@/store/StripeStore";
// Api
import { addOrder } from "@/api/order";
import { resolvePaymentIntent } from "@/api/payment";
// Services
import {
  deleteOrderFromBdd,
  getOrderService,
} from "@shared/services/SupabaseServices";
// Utils
import { stripePromise } from "@/utils/stripe";

export function useOrderProcess() {
  const route = useRoute();

  const cartStore = useCartStore();
  const orderStore = useOrderStore();
  const paymentStore = usePaymentStore();

  // States
  const loading = ref(false);
  const error = ref(false);
  const payment_intent = String(route.query.payment_intent || "");

  // Order displays ans mutations
  async function loadLastOrder(
    payment_status?: "paid",
  ): Promise<Order | null> {
    try {
      const order = await getOrderService(payment_status);
      if (!order) return null;
      orderStore.setOrder(order);
      return order;
    } catch (err) {
      console.error(err);
      error.value = true;
      return null;
    }
  }
  async function createOrder(
    cart: CartType,
    carrierId: Transporter["id"],
    paymentIntentId: string,
  ): Promise<Order> {
    const order = await addOrder({
      products: cart.products,
      payment_ID: paymentIntentId,
      delivery_carrier: carrierId,
    });
    if (!order) throw new Error("Order creation failed");
    orderStore.setOrder(order);

    return order;
  }
  async function deleteOrder(orderId: Order["id"]): Promise<boolean> {
    try {
      return await deleteOrderFromBdd(orderId);
    } catch (err) {
      console.error(err);
      error.value = true;
      return false;
    }
  }
  async function resetOrder(order?: Order | null): Promise<boolean> {
    const last = order ?? await loadLastOrder();
    if (!last) return false;
    const paymentStore = usePaymentStore();

    if (
      !paymentStore.paymentIntentId &&
      last.payment_ID
    ) {
      paymentStore.initWithExistingPi(last.payment_ID);
    }

    const current = orderStore.orderModel;
    if (!current?.data.id) return false;
    const deleted = await deleteOrder(current.data.id);

    if (!deleted) {
      throw new Error("Order deletion failed");
    }
    orderStore.resetOrderDraft();

    return true;
  }

  // Stripe payment
  async function resolveOrderPayment(): Promise<ResolvePaymentIntentResponse> {
    const order = orderStore.orderModel?.data;
    const amount = orderStore.totalPriceInCents;
    if (!order) throw new Error("Order missing");

    const payload = {
      paymentIntentId: order.payment_ID ?? "",
      amount: amount,
      currency: "eur",
      metadata: {
        orderId: order.id ?? "",
        cartId: order.cart_id ?? "",
        userId: order.user_id ?? "",
      },
    };
    orderStore.setOrder(order);

    return await resolvePaymentIntent(payload);
  }
  async function verifyStripePayment(
    clientSecret: string,
  ): Promise<PaymentIntentResult | null> {
    const stripe = await stripePromise;
    if (!stripe) return null;
    return await stripe.retrievePaymentIntent(clientSecret);
  }
  async function confirmPaidOrder(): Promise<Order | null> {
    const data = await loadLastOrder("paid");
    if (!data) throw new Error("Order not found");
    orderStore.setOrder(data);
    return data;
  }

  // Map Orders to compare
  function mapOrder(
    order: Order | { delivery_carrier: string; cart: CartType },
  ) {
    return {
      delivery_carrier: order.delivery_carrier,
      products: order.cart.products.map((p: cartProduct) => ({
        id: p.id,
        quantity: p.quantity,
      })),
    };
  }
  async function syncCartWithOrder(): Promise<void> {
    // Get transporter
    const transporterId = orderStore.deliveryDetails?.transporter?.id;
    if (!transporterId) {
      throw new Error("Missing transporter before order creation");
    }

    // Get local - bdd order and compare
    const bddOrder = await loadLastOrder();
    const localOrder = {
      delivery_carrier: transporterId,
      cart: cartStore.cart,
    };
    if (!bddOrder) return;

    const mappedBdd = mapOrder(bddOrder);
    const mappedLocal = mapOrder(localOrder);

    const isIdentical =
      mappedLocal.delivery_carrier === mappedBdd.delivery_carrier &&
      mappedLocal.products.length === mappedBdd.products.length &&
      mappedLocal.products.every((p, i) =>
        p.id === mappedBdd.products[i].id &&
        p.quantity === mappedBdd.products[i].quantity
      );

    if (isIdentical) return;

    // If bdd and local order are different, re-create order
    await resetOrder(bddOrder);
    const paymentIntentId = paymentStore.paymentIntentId;
    if (!paymentIntentId) {
      throw new Error("Missing payment intent");
    }
    await createOrder(
      cartStore.cart,
      transporterId,
      paymentIntentId,
    );
  }

  return {
    loading,
    error,
    payment_intent,
    loadLastOrder,
    createOrder,
    deleteOrder,
    resetOrder,
    resolveOrderPayment,
    verifyStripePayment,
    confirmPaidOrder,
    syncCartWithOrder,
  };
}
