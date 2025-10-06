import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '@/views/ShopView.vue'
import Product from '@/views/ProductView.vue'
import Cart from '@/views/CartView.vue'
import Auth from '@/views/AuthView.vue'
import Checkout from '@/views/CheckoutView.vue'

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
      path: '/cart',
      name: 'cart',
      component: Cart,
      meta: { title: 'Panier', breadcrumb: 'Panier' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: { title: 'Authentification', breadcrumb: 'Authentification' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      meta: { title: 'Passation de commande', breadcrumb: 'Commande en cours' },
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
