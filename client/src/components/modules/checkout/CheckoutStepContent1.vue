<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
// Ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
// Components
import CheckoutPickupMap from './CheckoutPickupMap.vue'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Composables
import { useLivraisonDetails } from '@/composables/useLivraisonDetails'

// Data
const stepStore = usecheckoutStepper()
const { shippingOptions } = useLivraisonDetails()
const currentCarrier = computed(() => stepStore.carrier)
const selectThisCarrier = (carrierID: string) => {
  stepStore.setTransporter(carrierID)
}
const priceWith2Decimals = (transporterPrice: number): string => {
  const price = transporterPrice || 0
  return price.toFixed(2)
}

const mapComponentIsLoaded = ref(false)
const activeTab = ref<string>('home_delivery')
function updateMapVisible(newState: boolean) {
  mapComponentIsLoaded.value = newState
}
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
        <li v-for="transporters in shippingOption?.transporters">
          <Button
            type="button"
            :class="[
              'flex flex-col w-full h-auto bg-background border text-foreground gap-0 items-start pl-15',
              currentCarrier === transporters.id ? 'selected' : null,
            ]"
            @click="selectThisCarrier(transporters.id)"
          >
            <span class="flex justify-between w-full">
              <span class="label">{{ transporters.name }}</span>
              <span class="price"
                >{{ priceWith2Decimals(transporters.price) }} {{ transporters.currency }}</span
              >
            </span>
            <span class="desc"> Livraison en {{ transporters.estimated_delivery_time }} </span>
          </Button>
        </li>
      </ul>
      <template v-if="shippingOption.id === 'pickup_point'">
        <div v-show="mapComponentIsLoaded">
          <keep-alive>
            <CheckoutPickupMap :mapComponentIsLoaded @isMapVisible="updateMapVisible" :activeTab />
          </keep-alive>
        </div>
      </template>
    </TabsContent>
  </Tabs>
</template>
<style lang="css">
@import '@/assets/styles/order.css';
</style>
