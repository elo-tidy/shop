import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import Product from '../views/Product.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalogue',
      component: ProductList,
      meta: { title: 'Catalogue produits', breadcrumb: 'Produits' },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: Product,
      meta: { title: 'Fiche produit', breadcrumb: 'Détail' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Page About', breadcrumb: 'About' },
    },
  ],
})

export default router
