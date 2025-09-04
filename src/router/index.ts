import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '@/views/ShopView.vue'
import Product from '@/views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/catalogue',
      name: 'catalogue',
      component: ProductList,
      meta: { title: 'Catalogue', breadcrumb: 'Produits' },
    },
    {
      path: '/catalogue/product/:id',
      name: 'product',
      component: Product,
      props: true,
      meta: { title: 'Fiche produit', breadcrumb: 'Détail' },
    },
    {
      path: '/404',
      name: '404',
      component: Product,
      meta: { title: 'Page introuvable', breadcrumb: 'Page introuvable' },
    },
    // {
    //   path: '/catalogue/categorie/:slug',
    //   name: 'categorie',
    //   component: CategoryList,
    //   meta: { title: 'Page catégorie', breadcrumb: 'Catégorie' },
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Page About', breadcrumb: 'About' },
    },
  ],
})

export default router
