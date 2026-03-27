import { computed, type Ref} from 'vue'
// Types
import type { productCatalog } from '@/types/Product'
// Models
import { Product } from '@/models/Product'

export function useProductModel(storeProductData: Ref<productCatalog | undefined>) {
  const product = computed(() =>
    storeProductData.value ? new Product(storeProductData.value) : null,
  )

  const formattedPrice = computed(() => product.value?.formattedPrice)
  const shortTitle = computed(() => product.value?.shortTitle)
  const shortDesc = computed(() => product.value?.shortDesc)
  const imageAlt = computed(() => product.value?.imageAlt)
  const quantity = computed(() => product.value?.quantity)
  const stock = computed(() => product.value?.stock ?? 0)
  const archived = computed(() => product.value?.archived ?? false)

  return {
    product,
    formattedPrice,
    shortTitle,
    shortDesc,
    imageAlt,
    quantity,
    stock,
    archived
  }
}
