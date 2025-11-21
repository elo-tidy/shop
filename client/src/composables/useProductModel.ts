import { computed } from 'vue'
import type { Ref } from 'vue'
import type { ProductApi } from '@/types/Product'
import { Product } from '@/models/Product'

export function useProductModel(storeProductData: Ref<ProductApi | undefined>) {
  const product = computed(() =>
    storeProductData.value ? new Product(storeProductData.value) : null,
  )

  const formattedPrice = computed(() => product.value?.formattedPrice)
  const shortTitle = computed(() => product.value?.shortTitle)
  const shortDesc = computed(() => product.value?.shortDesc)
  const imageAlt = computed(() => product.value?.imageAlt)
  const quantity = computed(() => product.value?.quantity)

  return {
    product,
    formattedPrice,
    shortTitle,
    shortDesc,
    imageAlt,
    quantity,
  }
}
