import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/store/ProductStore'
import { Category } from '@/models/Category'

export function useBreadcrumbs() {
  const router = useRouter()
  const route = useRoute()
  const productStore = useProductStore()

  const breadcrumbs = ref<{ name: string; path: string }[]>([])

  watchEffect(async () => {
    let matched = route.matched.filter((r) => r.meta?.breadcrumb)

    // Inject catalogue page if not matched
    if (route.name === 'product' || route.name === 'categorie') {
      const catalogueRoute = router.getRoutes().find((r) => r.meta?.breadcrumb === 'Catalogue')

      if (catalogueRoute) {
        matched = [catalogueRoute, ...matched]
      }
    }

    const result = await Promise.all(
      matched.map(async (routeItem, index) => {
        const isLast = index === matched.length - 1

        // Cas : Fiche produit
        if (isLast && route.name === 'product' && 'id' in route.params) {
          const id = route.params.id as string
          let product = productStore.getProductById(id)

          if (!product) {
            productStore.loadProducts()
            product = productStore.getProductById(id)
          }

          return {
            name: product?.title ?? 'Produit inconnu',
            path: route.fullPath,
          }
        }

        if (isLast && route.name === 'categorie' && 'slug' in route.params) {
          const slug = route.params.slug as string

          try {
            const response = await fetch('https://fakestoreapi.com/products/categories')
            const data: string[] = await response.json()
            const categories = data.map((item) => new Category(item))
            const found = categories.find((c) => c.slug === slug)

            return {
              name: found?.name ?? 'Catégorie inconnue',
              path: route.fullPath,
            }
          } catch (err) {
            return {
              name: 'Catégorie inconnue',
              path: route.fullPath,
            }
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
