import { createRouter, createWebHistory } from "vue-router";

// views
import ProductList from "@/views/ShopView.vue";
import Product from "@/views/ProductView.vue";
import Cart from "@/views/CartView.vue";
import Auth from "@/views/AuthView.vue";
import Checkout from "@/views/CheckoutView.vue";
import AdminDashboard from "@/views/admin/AdminDashboardView.vue";
import AdminAddProducts from "@/views/admin/AdminProductAddView.vue";
import NotFound from "@/views/NotFound.vue";
import ForbiddenView from "@/views/ForbiddenView.vue";

// composables
import { useIsUserAdmin } from "@/composables/useIsUserAdmin";

// Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "catalogue",
      component: ProductList,
      meta: { title: "Catalogue", breadcrumb: "Catalogue" },
    },
    {
      path: "/product/:id",
      name: "product",
      component: Product,
      meta: { title: "Fiche produit", breadcrumb: "Détail" },
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart,
      meta: { title: "Panier", breadcrumb: "Panier" },
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth,
      meta: { title: "Authentification", breadcrumb: "Authentification" },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
      meta: { title: "Passation de commande", breadcrumb: "Commande en cours" },
    },

    {
      path: "/404",
      name: "404",
      component: NotFound,
      meta: { title: "Page introuvable", breadcrumb: "Page introuvable" },
    },
    {
      path: "/admin",
      children: [
        {
          path: "",
          component: AdminDashboard,
          name: "admin",
          meta: {
            title: "Gestion des produits",
            breadcrumb: "Gestion des produits",
            requiresAdmin: true,
          },
        },
        {
          path: "product/add",
          name: "add-product",
          component: AdminAddProducts,
          meta: {
            title: "Ajouter un produit au catalogue",
            breadcrumb: "Ajouter un produit au catalogue",
            requiresAdmin: true,
          },
        },
        {
          path: "product/:id",
          name: "patch-product",
          component: AdminAddProducts,
          meta: {
            title: "Modifier la fiche produit",
            breadcrumb: "Modification de la fiche produit",
            requiresAdmin: true,
          },
          props: (route) => ({
            id: Number(route.params.id),
          }),
        },
      ],
    },
    {
      path: "/forbidden",
      name: "forbidden",
      component: ForbiddenView,
      meta: { title: "Accès interdit", breadcrumb: "Accès interdit" },
    },
    // {
    //   path: '/catalogue/categorie/:slug',
    //   name: 'categorie',
    //   component: CategoryList,
    //   meta: { title: 'Page catégorie', breadcrumb: 'Catégorie' },
    // },
  ],
});

// Redirect if not admin
router.beforeEach(async (to) => {
  const { currentSessionIsAdmin, init } = useIsUserAdmin();
  await init();

  if (to.meta.requiresAdmin && !currentSessionIsAdmin.value) {
    return {
      name: "forbidden",
    };
  }
});

export default router;
