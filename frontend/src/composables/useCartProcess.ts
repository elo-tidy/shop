import { computed, defineComponent, h, markRaw } from "vue";
// Types
import type { cartProduct } from "@shared/types/Cart";
import type { productCatalog } from "@shared/types/Product";
// Ui
import { toast } from "vue-sonner";
// Stores
import { useCartStore } from "@/store/CartStore";

export function useCartProcess() {
  const cartStore = useCartStore();

  const wordingTotalNumberOfItem = computed(() => {
    return cartStore.getCartTotalItems > 1 ? "articles" : "article";
  });

  // Notify user that item has been added to cart
  const customToast = defineComponent({
    setup() {
      return () =>
        h("div", { class: "grid" }, [
          h("p", "Le produit a été ajouté au panier."),
          h(
            "p",
            `Vous avez ${cartStore.getCartTotalItems} ${wordingTotalNumberOfItem.value} dans votre panier.`,
          ),
          h("div", {
            innerHTML:
              '<Button type="button" class="bg-primary text-background px-3 py-1 ">Voir le panier</Button>',
            class: "mt-2 justify-end grid",
            onClick: () => {
              window.location.href = "/cart";
            },
          }),
        ]);
    },
  });

  const addThisProductToCart = (product: cartProduct, quantity: number) => {
    cartStore.addToCart(product, quantity);
    cartStore.getCartTotalItems;
    toast(markRaw(customToast));
  };

  const deleteThisProductfromCart = async (productId: number) => {
    cartStore.deleteFromCart(productId);
  };

  const updateItemQuantity = async (
    productId: number,
    addOrRemove: "add" | "remove",
  ) => {
    if (limitUpdateQty(productId, addOrRemove)) return;
    cartStore.updateItemQuantity(productId, addOrRemove);
  };

  function isCatalogProduct(p: any): p is productCatalog {
    return "stock" in p;
  }
  const limitUpdateQty = (
    productId: cartProduct["id"],
    addOrRemove?: "add" | "remove",
  ): boolean => {
    const product = cartStore.getCartProductsById(productId!);
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
