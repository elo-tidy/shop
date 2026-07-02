import { defineStore } from "pinia";
import { computed, ref } from "vue";
// Types
import type { cartProduct } from "@shared/types/Cart";
import type { Order } from "@shared/types/Order";
import type { DeliveryMode, Transporter } from "@shared/types/ShippingMode";
import type { productCatalog } from "@shared/types/Product";
// Models
import { OrderModel } from "@/models/Order";
// Services
import { getCarrierDetails } from "@/services/CarrierService";
// Utils
import {
  numberWithTwoDecimals,
  priceFromEurosToCents,
} from "@shared/utils/maths";
// Stores
import { useCartStore } from "@/store/CartStore";

export const useOrderStore = defineStore(
  "order",
  () => {
    // State
    // const orderModel = ref<OrderModel | null>(null)
    const orderData = ref<Order | null>(null);
    const deliveryDetails = ref<
      {
        deliveryMode: DeliveryMode["name"];
        deliveryDate: string | null;
        transporter: Transporter;
      } | null
    >(null);

    const orderModel = computed((): OrderModel | null => {
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
    const stripePayload = computed(() =>
      orderModel.value?.stripePayload ?? null
    );

    // Actions
    function setOrder(data: Order): void {
      // orderModel.value = new OrderModel(data)
      orderData.value = data;
    }
    const isCatalogProduct = (p: unknown): p is productCatalog => {
      return typeof p === "object" && p !== null && "id" in p && "price" in p;
    };
    function initOrder(
      userId: string,
      paymentIntentId: string | null = null,
    ): void {
      const cartStore = useCartStore();

      const cart = cartStore.cart;
      const deliveryPrice = deliveryDetails.value?.transporter?.price ?? 0;
      const delivery_carrier_id = deliveryDetails.value?.transporter?.id ?? "";

      const carts_products = cart.products.map((
        p: cartProduct,
      ) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.image,
        category: p.category,
        quantity: p.quantity ?? 1,
        stock: (isCatalogProduct(p) ? p.stock : 0) ?? 0,
      }));

      const productsPrice = cart.products.reduce(
        (total: number, p: cartProduct) => total + p.price * (p.quantity ?? 1),
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
    function resetOrderDraft(): void {
      orderData.value = null;
    }
    function clearOrder(): void {
      resetOrderDraft();
      clearLivraisonDetails();
    }
    function reloadOrderProducts(products: cartProduct[]): void {
      //   orderModel.value?.setProducts(products)
      if (!orderData.value) return;
      orderData.value.cart.products = [...products];
    }

    async function setLivraisonDetails(
      transporterId: Transporter["id"],
    ): Promise<void> {
      deliveryDetails.value = await getCarrierDetails(transporterId);
    }
    function clearLivraisonDetails(): void {
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
      stripePayload,
      totalPriceInCents,
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
