import { computed, defineComponent, h, markRaw } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
// Types
import type { cartProduct } from "@shop/shared/types/Cart";
import type { productCatalog } from "@shop/shared/types/Product";
// Ui
import { toast } from "vue-sonner";
// Stores
import { useCartStore } from "@/store/CartStore";

export function useCartProcess() {
  const cartStore = useCartStore();
  const router = useRouter();

  const totalItems = computed(() => cartStore.getCartTotalItems);
  const wordingTotalNumberOfItem = computed(() => {
    return totalItems.value > 1 ? "articles" : "article";
  });

  // Notify user that item has been added to cart
  const customToast = defineComponent({
    setup() {
      return () =>
        h("div", { class: "grid" }, [
          h("p", "Le produit a été ajouté au panier."),
          h(
            "p",
            `Vous avez ${totalItems.value} ${wordingTotalNumberOfItem.value} dans votre panier.`,
          ),
          h("p", { class: "grid justify-end" }, [
            h(
              RouterLink,
              {
                to: "/cart",
                class: "bg-primary text-background px-3 py-1 mt-2",
              },
              {
                default: () => "Voir le panier",
              },
            ),
          ]),
        ]);
    },
  });

  const addThisProductToCart = (product: cartProduct, quantity: number) => {
    cartStore.addToCart(product, quantity);
    cartStore.getCartTotalItems;
    toast(markRaw(customToast));
  };

  const deleteThisProductfromCart = (productId: number) => {
    cartStore.deleteFromCart(productId);
  };

  const updateItemQuantity = (
    productId: number,
    addOrRemove: "add" | "remove",
  ) => {
    if (limitUpdateQty(productId, addOrRemove)) return;
    cartStore.updateItemQuantity(productId, addOrRemove);
  };

  function isCatalogProduct(p: unknown): p is productCatalog {
    return typeof p === "object" && p !== null && "stock" in p;
  }

  const limitUpdateQty = (
    productId: cartProduct["id"],
    addOrRemove?: "add" | "remove",
  ): boolean => {
    const product = cartStore.getCartProductsById(productId);
    if (!product || !isCatalogProduct(product)) return false;
    if (product.quantity >= product.stock && addOrRemove === "add") {
      return true;
    }
    return false;
  };

  return {
    addThisProductToCart,
    deleteThisProductfromCart,
    updateItemQuantity,
    limitUpdateQty,
    wordingTotalNumberOfItem,
  };
}
