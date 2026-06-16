<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
// Types
import type { ShippingMode, Transporter } from '@/types/ShippingMode'
// Ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
// Components
// import CheckoutPickupMap from './CheckoutPickupMap.vue'
// Utils
import { numberWithTwoDecimals } from '@/utils/maths'
// Services
import { fetchShippingOptions } from '@/services/ShippingOptions'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
import { useOrderStore } from '@/store/OrderStore'

// Ref
const shippingOptions = ref<ShippingMode | null>(null)
const activeTab = ref<string>('home_delivery')

// Transporter details
const stepStore = usecheckoutStepper()
const orderStore = useOrderStore()
const currentCarrier = computed(() => orderStore.deliveryDetails?.transporter.id)
const selectCarrier = async (transporterId: string): Promise<void> => {
  await orderStore.setLivraisonDetails(transporterId)
}

// Map
const mapComponentIsLoaded = ref(false)
function updateMapVisible(newState: boolean): void {
  mapComponentIsLoaded.value = newState
}

// Load Transporters'list
onMounted(async () => {
  shippingOptions.value = await fetchShippingOptions()
})
</script>
<template>
  <Tabs
    defaultValue="home_delivery"
    id="order-shipping-mode"
    v-model="activeTab"
    :unmountOnHide="false"
  >
    <TabsList class="w-full grid grid-cols-2 h-auto">
      <TabsTrigger
        asChild
        v-for="shippingOption in shippingOptions?.delivery_modes"
        :key="shippingOption.id"
        class="whitespace-normal p-0"
        :value="shippingOption.id"
      >
        <h3>
          <Button class="w-full bg-transparent text-inherit hover:bg-transparent" type="Button">{{
            shippingOption.name
          }}</Button>
        </h3>
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="shippingOption in shippingOptions?.delivery_modes"
      :value="shippingOption.id"
    >
      <p>{{ shippingOption.description }}</p>
      <ul class="mt-4 grid gap-2">
        <li v-for="transporter in shippingOption?.transporters">
          <Button
            type="button"
            :class="[
              'flex flex-col w-full h-auto bg-background border text-foreground gap-0 items-start pl-15',
              currentCarrier === transporter.id ? 'selected' : null,
            ]"
            @click="selectCarrier(transporter.id)"
          >
            <span class="flex justify-between w-full">
              <span class="label">{{ transporter.name }}</span>
              <span class="price"
                >{{ numberWithTwoDecimals(transporter.price) }} {{ transporter.currency }}</span
              >
            </span>
            <span class="desc"> Livraison en {{ transporter.estimated_delivery_time }} </span>
          </Button>
        </li>
      </ul>
      <!--<template v-if="shippingOption.id === 'pickup_point'">
        <div v-show="mapComponentIsLoaded">
          <keep-alive>
            <CheckoutPickupMap :mapComponentIsLoaded @isMapVisible="updateMapVisible" :activeTab />
          </keep-alive>
        </div>
      </template>-->
    </TabsContent>
  </Tabs>
</template>
