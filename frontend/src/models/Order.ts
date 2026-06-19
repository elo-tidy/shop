import type { Order } from "@shared/types/Cart";
import type { DeliveryMode, Transporter } from "@shared/types/ShippingMode";

import { priceFromEurosToCents } from "@/utils/maths";
import { estimatedDelivery } from "@shared/composables/useDeliveryEstimation";

export class OrderModel {
  constructor(
    private order: Order,
    private delivery?: {
      deliveryMode: DeliveryMode["name"];
      transporter: Transporter;
    },
  ) {}

  get data(): Order {
    return this.order;
  }

  get totalPrice(): number {
    return this.order.total_price;
  }

  get productsPrice(): number {
    return this.order.products_price;
  }

  get deliveryPrice(): number {
    return this.order.delivery_price;
  }

  get isPaid(): boolean {
    return this.order.payment_status === "paid";
  }

  get isConfirmed(): boolean {
    return this.order.stripe_event_id != null &&
      this.order.stripe_event_id !== "";
  }

  // get deliveryDetails() {
  //   return this.delivery
  // }

  // get deliveryDate() {
  //   if (!this.transporter?.estimated_delivery_time) {
  //     return null
  //   }

  //   return estimatedDelivery(
  //     this.order.created_at,
  //     this.transporter.estimated_delivery_time,
  //   )
  // }

  get stripePayload() {
    if (!this.order.delivery_carrier) {
      throw new Error("Missing delivery_carrier in order");
    }
    return {
      orderId: this.order.id ?? "",
      cartId: this.order.cart.id ?? "",
      userId: this.order.user_id ?? "",
      paymentIntentId: this.order.payment_ID ?? "",
      amount: priceFromEurosToCents(this.order.total_price),
      currency: "eur",
    };
  }

  setProducts(products: Order["carts"]["products"]) {
    this.order.cart.products = products;
  }
}
