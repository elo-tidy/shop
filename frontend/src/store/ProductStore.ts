import { defineStore } from "pinia";
import { computed, ref } from "vue";
// Types
import type { productCatalog } from "@shared/types/Product";
// Services
import { fetchAllProducts } from "@/services/ShopService";

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
    async function loadProducts() {
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
    function updateCurrentCategory(category: string | null) {
      currentCategory.value = category;
    }
    function addProductToStore(product: productCatalog) {
      products.value.push(product);
    }
    function removeProductFromStore(id: number) {
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value.splice(index, 1);
      }
    }
    function updateProductInStore(product: productCatalog) {
      products.value = products.value.map((p) =>
        p.id === product.id ? product : p
      );
    }
    function setAdminDisplay(isAdmin: boolean) {
      adminDisplay.value = isAdmin;
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
    };
  },
  {
    persist: true,
  },
);
