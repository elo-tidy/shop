import { computed, type Ref } from "vue";
// Types
import type { productCatalog } from "@shared/types/Product";
// Models
import { Product } from "@/models/Product";

export function useProductModel(storeProductData: Ref<productCatalog | null>) {
  const product = computed(() =>
    storeProductData.value ? new Product(storeProductData.value) : null
  );

  const formattedPrice = computed(() => product.value?.formattedPrice);
  const shortTitle = computed(() => product.value?.shortTitle);
  const shortDesc = computed(() => product.value?.shortDesc);
  const imageAlt = computed(() => product.value?.imageAlt);
  const stock = computed(() => product.value?.stock ?? 0);
  const archived = computed(() => product.value?.archived ?? false);

  return {
    product,
    formattedPrice,
    shortTitle,
    shortDesc,
    imageAlt,
    stock,
    archived,
  };
}
