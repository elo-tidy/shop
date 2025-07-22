// composables/useBreadcrumbs.ts
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { watchEffect, ref } from 'vue'

export function useBreadcrumbs() {
  const router = useRouter()
  const route = useRoute()
  const productStore = useProductStore()

  const breadcrumbs = ref<{ name: string; path: string }[]>([])

  watchEffect(async () => {
    let matched = route.matched.filter((routeItem) => routeItem.meta?.breadcrumb)

    const findCatalogueRoute = () =>
      router.getRoutes().find((routeItem) => routeItem.meta?.breadcrumb === 'Produits')

    if (route.name === 'product') {
      const catalogueRoute = findCatalogueRoute()

      if (catalogueRoute) {
        matched = [catalogueRoute, ...matched]
      }
    }

    const result = await Promise.all(
      matched.map(async (routeItem, index) => {
        const isLast = index === matched.length - 1

        if (isLast && 'id' in route.params) {
          const id = route.params.id as string
          let product = productStore.getProductById(id)

          if (!product) {
            await productStore.fetchProducts()
            product = productStore.getProductById(id)
          }

          return {
            name: product?.title ?? 'Produit inconnu',
            path: route.fullPath,
          }
        }

        return {
          name: routeItem.meta.breadcrumb as string,
          path: routeItem.path.includes(':') ? route.path : routeItem.path,
        }
      }),
    )

    breadcrumbs.value = result
  })

  return { breadcrumbs }
}
