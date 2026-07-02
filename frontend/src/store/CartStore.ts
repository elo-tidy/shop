import { defineStore } from "pinia";
import { computed, reactive } from "vue";
// Types
import type { productCatalog } from "@shared/types/Product";
import type { cartProduct, CartType } from "@shared/types/Cart";
//  Models
import { Cart } from "@/models/Cart";

export const useCartStore = defineStore(
  "cart",
  () => {
    // State
    const cart = reactive(
      new Cart({
        id: "",
        products: [],
      }),
    );

    // Getters
    const getCartTotalItems = computed(() => cart.totalNumberOfItem);
    const getCartTotalPrice = computed(() => cart.totalPrice);
    const getCartProducts = computed(() => cart.products);
    const getItemQuantity = (
      productId: cartProduct["id"],
    ): number => cart.getItemQuantity(productId);

    // Actions
    function addToCart(
      product: cartProduct,
      itemQuantity: cartProduct["quantity"],
    ): void {
      cart.addItemToCart(product, itemQuantity);
    }
    function deleteFromCart(productId: cartProduct["id"]): void {
      cart.deleteItemFromCart(productId);
    }
    function updateItemQuantity(
      productId: cartProduct["id"],
      addOrRemove: "add" | "remove",
    ): void {
      cart.updateItemQuantity(productId, addOrRemove);
    }
    function clearCartStore(): void {
      cart.clearCart();
    }
    const getCartProductsById = (
      productId: productCatalog["id"],
    ): cartProduct | undefined => {
      return cart.getProduct(productId);
    };

    return {
      cart,
      getCartTotalItems,
      getCartTotalPrice,
      getCartProducts,
      addToCart,
      deleteFromCart,
      updateItemQuantity,
      clearCartStore,
      getItemQuantity,
      getCartProductsById,
    };
  },
  {
    persist: true,
  },
);
