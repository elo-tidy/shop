import { computed, reactive } from 'vue'
import { Product as ProductModel } from '@/models/Product'
import type { ProductApi } from '@/types/Product'

export function useProductModel(rawProductData: ProductApi) {
  const product = reactive(new ProductModel(rawProductData))

  const formattedPrice = computed(() => product.formattedPrice)
  const shortTitle = computed(() => product.shortTitle)
  const shortDesc = computed(() => product.shortDesc)
  const imageAlt = computed(() => product.imageAlt)

  return {
    product,
    formattedPrice,
    shortTitle,
    shortDesc,
    imageAlt,
  }
}
