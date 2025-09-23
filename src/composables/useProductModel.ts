import { computed, reactive } from 'vue'
import { Product as ProductModel } from '@/models/Product'
import type { ProductApi } from '@/types/Product'

export function useProductModel(rawProductData: ProductApi) {
  const product = computed(() => new ProductModel(rawProductData))

  const formattedPrice = computed(() => product.value.formattedPrice)
  const shortTitle = computed(() => product.value.shortTitle)
  const shortDesc = computed(() => product.value.shortDesc)
  const imageAlt = computed(() => product.value.imageAlt)
  const quantity = computed(() => product.value.quantity)

  return {
    product,
    formattedPrice,
    shortTitle,
    shortDesc,
    imageAlt,
    quantity,
  }
}
