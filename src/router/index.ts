import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '@/views/ShopView.vue'
import Product from '@/views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalogue',
      component: ProductList,
      meta: { title: 'Catalogue', breadcrumb: 'Catalogue' },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: Product,
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
  ],
})

export default router
