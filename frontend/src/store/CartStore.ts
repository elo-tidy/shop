import { defineStore } from "pinia";
import { computed, reactive, ref, toRefs } from "vue";
// Types
import type { productCatalog } from "@shared/types/Product";
import type { cartProduct, CartType } from "@shared/types/Cart";
//  Models
import { Cart } from "@/models/Cart";
// Stores
import { usecheckoutStepper } from "./OrderStepperStore";
// Utils
import {
  formatPriceWithTwoDecimals,
  numberWithTwoDecimals,
  priceFromEurosToCents,
} from "@/utils/maths";

export const useCartStore = defineStore(
  "cart",
  () => {
    // State
    const cart = reactive(
      new Cart({
        id: "",
        products: [],
      } as CartType),
    );

    // Getters
    const getCartTotalItems = computed(() => cart.totalNumberOfItem);
    const getCartTotalPrice = computed(() => cart.totalPrice);
    // const getCartTotalPriceInCents = computed(() => priceFromEurosToCents(cart.totalPrice))
    const getCartProducts = computed(() => cart.products);
    const getItemQuantity = (productId: cartProduct["id"]) =>
      cart.getItemQuantity(productId);
    const getItemArchivedStatus = (productId: cartProduct["id"]) =>
      cart.getItemArchivedStatus(productId);

    // Actions
    function addToCart(product: cartProduct, itemQuantity: number) {
      cart.addItemToCart(product, itemQuantity);
    }
    function deleteFromCart(productId: number) {
      cart.deleteItemFromCart(productId);
    }
    function updateItemQuantity(
      productId: number,
      addOrRemove: "add" | "remove",
    ) {
      cart.updateItemQuantity(productId, addOrRemove);
    }
    function clearCartStore() {
      cart.clearCart();
    }
    const getCartProductsById = (productId: productCatalog["id"]) => {
      return cart.getProduct(productId);
    };

    return {
      cart,
      getCartTotalItems,
      getCartTotalPrice,
      // getCartTotalPriceInCents,
      getCartProducts,
      addToCart,
      deleteFromCart,
      updateItemQuantity,
      clearCartStore,
      getItemQuantity,
      getItemArchivedStatus,
      getCartProductsById,
    };
  },
  {
    persist: true,
  },
);
