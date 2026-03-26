<script lang="ts" setup>
// Ui
import Button from '@/components/ui/button/Button.vue'
// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductList from '@/components/modules/product/ProductList.vue'
// composables
import { useProductStore } from '@/store/ProductStore'
const productStore = useProductStore()

productStore.setAdminDisplay(true)
</script>
<template>
  <h1 class="mb-10 text-[30px]">Espace administrateur</h1>

  <Tabs default-value="products">
    <TabsList class="mb-6">
      <TabsTrigger value="products">Gestion des produits</TabsTrigger>
      <TabsTrigger value="commandes">Gestion des commandes</TabsTrigger>
    </TabsList>
    <TabsContent value="products">
      <h2 class="sr-only">Gestion des produits</h2>
      <p>
        <Button asChild>
          <RouterLink class="btn-icon bg-primary mb-4" :to="{ name: 'add-product' }">
            <span>Ajouter un produit au catalogue</span>
          </RouterLink>
        </Button>
      </p>
      <!--
    <ul class="grid bg-background border border-b-0">
      <li class="not-first:border-t p-5" v-for="item in products" :key="item.id">
      <li class="" v-for="item in products" :key="item.id">
        <productItem layout="admin" display="grid" :showItemId="true" :hn="3"/>
      </li>
    </ul>
  -->

      <ProductList layout="admin" :showItemId="true" :hn="3" />
    </TabsContent>
    <TabsContent value="commandes">
      <h2 class="sr-only">Gestion des commandes</h2>
      Contenu pour gérer les commandes</TabsContent
    >
  </Tabs>
</template>
