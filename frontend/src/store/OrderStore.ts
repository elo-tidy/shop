import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import type { CartType, Order } from "@shared/types/Cart";
import type { DeliveryMode, Transporter } from "@shared/types/ShippingMode";
import { OrderModel } from "@/models/Order";
import { getCarrierDetails } from "@/services/CarrierService";
import { priceFromEurosToCents } from "@/utils/maths";
import { useCartStore } from "./CartStore";
import { usecheckoutStepper } from "./OrderStepperStore";
import { numberWithTwoDecimals } from "../utils/maths";
import { useSupabaseSession } from "../composables/useSupabaseSession";
import { estimatedDelivery } from "@shared/composables/useDeliveryEstimation";

export const useOrderStore = defineStore(
  "order",
  () => {
    // State
    // const orderModel = ref<OrderModel | null>(null)
    const orderData = ref<Order | null>(null);
    const deliveryDetails = ref<
      {
        deliveryMode: DeliveryMode["name"];
        deliveryDate: String | null;
        transporter: Transporter;
      } | null
    >(null);

    const orderModel = computed(() => {
      if (!orderData.value) return null;
      return new OrderModel(orderData.value);
    });

    // Getters
    const totalPrice = computed(() => orderModel.value?.totalPrice ?? 0);
    const totalPriceInCents = computed(() =>
      priceFromEurosToCents(totalPrice.value)
    );
    const productsPrice = computed(() => orderModel.value?.productsPrice ?? 0);
    const deliveryPrice = computed(() => orderModel.value?.deliveryPrice ?? 0);
    const isPaid = computed(() => orderModel.value?.isPaid ?? false);
    const isConfirmed = computed(() => {
      return orderModel.value?.isConfirmed ?? false;
    });
    // const deliveryDate = computed(() => orderModel.value?.deliveryDate ?? null)
    const stripePayload = computed(() =>
      orderModel.value?.stripePayload ?? null
    );
    // const totalPriceInCents = computed(() => {
    //     return priceFromEurosToCents(Math.round(orderModel.value?.totalPrice ?? 0))
    // })
    // const deliveryDetails = computed(() => orderModel.value?.deliveryDetails ?? null)

    // Actions
    function setOrder(data: Order) {
      // orderModel.value = new OrderModel(data)
      orderData.value = data;
    }
    function initOrder(userId: string, paymentIntentId: string | null = null) {
      const cartStore = useCartStore();
      const session = useSupabaseSession();

      const cart = cartStore.cart;
      // const delivery = ref<{deliveryMode: DeliveryMode['name'], transporter:Transporter} | null>(null)
      const deliveryPrice = deliveryDetails.value?.transporter?.price ?? 0;
      const delivery_carrier_id = deliveryDetails.value?.transporter?.id ?? "";

      const carts_products = cart.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image,
        category: p.category,
        quantity: p.quantity ?? 1,
        stock: p.stock ?? 0,
      }));

      const productsPrice = cart.products.reduce(
        (total, p) => total + p.price * (p.quantity ?? 1),
        0,
      );

      const orderDraft: Order = {
        id: "",
        user_id: userId,
        cart_id: "",

        payment_status: "pending",
        payment_method: "Carte bancaire",
        payment_ID: paymentIntentId,
        stripe_event_id: "",

        created_at: new Date().toDateString(),

        total_price: Number(
          numberWithTwoDecimals(productsPrice + deliveryPrice),
        ),
        products_price: Number(numberWithTwoDecimals(productsPrice)),

        delivery_price: Number(numberWithTwoDecimals(deliveryPrice)),
        delivery_status: "processing",
        delivery_carrier: delivery_carrier_id,
        delivery_date: "",

        cart: {
          id: cart.id ?? "0",
          products: carts_products,
        },
      };
      setOrder(orderDraft);
    }
    function resetOrderDraft() {
      orderData.value = null;
    }
    function clearOrder() {
      resetOrderDraft();
      clearLivraisonDetails();
    }
    function reloadOrderProducts(products: CartType["products"]) {
      //   orderModel.value?.setProducts(products)
      if (!orderData.value) return;
      // const model = new OrderModel(orderData.value)
      // model.setProducts(products)
      // orderData.value = model.data
      orderData.value.carts.products = [...products];
    }

    // function setDeliveryDate() {
    //     if (!deliveryDetails.value?.transporter?.estimated_delivery_time) {
    //         return null
    //     }
    //     return estimatedDelivery(
    //         new Date(),
    //         deliveryDetails.value?.transporter?.estimated_delivery_time,
    //     )
    // }

    async function setLivraisonDetails(transporterId: Transporter["id"]) {
      deliveryDetails.value = await getCarrierDetails(transporterId);
    }
    function clearLivraisonDetails() {
      deliveryDetails.value = null;
    }

    return {
      orderModel,
      orderData,
      deliveryDetails,
      totalPrice,
      productsPrice,
      deliveryPrice,
      isPaid,
      isConfirmed,
      //   deliveryDate,
      stripePayload,
      totalPriceInCents,
      //   delivery_carrier_id,
      setOrder,
      resetOrderDraft,
      initOrder,
      clearOrder,
      reloadOrderProducts,
      setLivraisonDetails,
      clearLivraisonDetails,
    };
  },
  {
    persist: true,
  },
);
