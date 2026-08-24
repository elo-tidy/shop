import { defineStore } from "pinia";
import { computed, ref } from "vue";
// Types
import type { productCatalog } from "@shop/shared/types/Product";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Database, Tables } from "@shop/shared/types/database";
// Services
import {
  fetchAllProducts,
  fetchProduct,
  subscribeCatalogChanges,
} from "@/services/ShopService";
// Composable

type ProductPayload = RealtimePostgresChangesPayload<
  Tables<"products">
>;
type StockPayload = RealtimePostgresChangesPayload<
  Tables<"product_stock">
>;

let unsubscribe: null | (() => void) = null;

export const useProductStore = defineStore(
  "product",
  () => {
    // State
    const adminDisplay = ref(false);
    const products = ref<productCatalog[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const currentCategory = ref<string | null>(null);
    const productsNb = computed((): number => products.value.length);

    // Getters
    const getProductById = computed(
      () => (id: productCatalog["id"]) => {
        return products.value.find((product) => product.id === id);
      },
    );
    const getPublicProducts = computed(() => {
      return products.value.filter((p) => p.archived === false && p.stock > 0);
    });
    const filteredProducts = computed(() => {
      if (adminDisplay.value === true) {
        return currentCategory.value
          ? products.value.filter((p) => p.category === currentCategory.value)
          : products.value;
      }
      return currentCategory.value
        ? getPublicProducts.value.filter((p) =>
          p.category === currentCategory.value
        )
        : getPublicProducts.value;
    });

    // Actions
    async function loadProducts(): Promise<void> {
      if (products.value.length > 0) return;

      isLoading.value = true;
      error.value = null;

      try {
        const data = await fetchAllProducts();
        products.value = data;
      } catch (err: any) {
        console.error("Erreur lors du fetch des produits", err);
        error.value = err.message || "Erreur inconnue";
      } finally {
        isLoading.value = false;
      }
    }
    function updateCurrentCategory(category: string | null): void {
      currentCategory.value = category;
    }
    function addProductToStore(product: productCatalog): void {
      products.value.push(product);
    }
    function removeProductFromStore(id: number): void {
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value.splice(index, 1);
      }
    }
    function updateProductInStore(product: productCatalog): void {
      products.value = products.value.map((p) =>
        p.id === product.id ? product : p
      );
    }
    function setAdminDisplay(isAdmin: boolean): void {
      adminDisplay.value = isAdmin;
    }

    function patchStockInStore(
      row: Tables<"product_stock">,
    ) {
      const product = products.value.find(
        (p) => p.id === row.product_id,
      );

      if (!product) return;

      product.stock = row.quantity ?? 0;
    }

    function initRealtimeSync() {
      if (unsubscribe) return;

      unsubscribe = subscribeCatalogChanges(async (payload) => {
        if (payload.table === "products") {
          switch (payload.eventType) {
            case "INSERT":
              await fetchProduct(payload.new.id);
              break;

            case "UPDATE":
              updateProductInStore(payload.new);
              break;

            case "DELETE":
              removeProductFromStore(payload.old.id);
              break;
          }
        }

        if (payload.table === "product_stock") {
          patchStockInStore(payload.new);
        }
      });
    }

    function stopRealtimeSync() {
      unsubscribe?.();
      unsubscribe = null;
    }

    return {
      products,
      isLoading,
      error,
      currentCategory,
      productsNb,
      getProductById,
      filteredProducts,
      loadProducts,
      updateCurrentCategory,
      addProductToStore,
      removeProductFromStore,
      updateProductInStore,
      setAdminDisplay,
      initRealtimeSync,
      stopRealtimeSync,
    };
  },
  {
    // persist: true,
  },
);
