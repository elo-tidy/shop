<script lang="ts" setup>
import { computed } from 'vue'
// Ui
import { Button } from '@/components/ui/button'
// Composables
import { useOrderProcess } from '@/composables/useOrderProcess'
// Stores
import { useOrderStore } from '@/store/OrderStore'
// Utils
import { numberWithTwoDecimals } from '@/utils/maths'

// Props
const props = defineProps<{
  GoToStep: (stepNumber: number) => void
}>()

// Data
const orderStore = useOrderStore()
// const { carrierInfo, isConfirmed, deliveryPrice } = useOrderProcess()

// Step edition
const isEditable = computed(() => !orderStore.isPaid)

// Delivery date
</script>
<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col justify-between h-full items-start">
      <p class="mb-2">
        <strong>{{ orderStore.deliveryDetails?.deliveryMode }}</strong> :
      </p>
      <address>
        Studio <br />
        Rue Saint-Honoré <br />
        75001 Paris<br />
        France
      </address>

      <Button
        v-if="isEditable"
        type="button"
        variant="link"
        class="text-primary underline p-0 text-[14px] mt-2"
        @click="props.GoToStep(0)"
        >Modifier <span class="sr-only">adresse de livraison</span></Button
      >
    </div>

    <div class="flex flex-col justify-between h-full items-start">
      <div>
        <p class="mb-2"><strong>Transporteur :</strong></p>
        <p>{{ orderStore.deliveryDetails?.transporter?.name }}</p>
        <p>
          Frais :
          {{ numberWithTwoDecimals(orderStore.deliveryDetails?.transporter.price ?? 0) }} €
        </p>
        <p>Livraison en {{ orderStore.deliveryDetails?.transporter.estimated_delivery_time }}</p>
      </div>

      <Button
        v-if="isEditable"
        type="button"
        variant="link"
        class="text-primary underline p-0 text-[14px] mt-2"
        @click="props.GoToStep(1)"
        >Modifier <span class="sr-only">le choix du transporteur</span></Button
      >
    </div>
  </div>

  <!-- <div v-if="stepStore.getLivraisonDetails?.deliveryModeId === 'pickup_point'">
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col justify-between h-full items-start">
        <p>
          <strong>{{ stepStore.getLivraisonDetails?.deliveryMode }}</strong
          >:
        </p>
        <address>
          Point relai <br />
          sélectionné <br />dans la carte
        </address>

        <Button
          type="button"
          variant="link"
          class="text-primary underline p-0 text-[14px] mt-2"
          @click="props.GoToStep(0)"
          >Modifier <span class="sr-only">adresse de livraison</span></Button
        >
      </div>

      <div class="flex flex-col justify-between h-full items-start">
        <div>
          <p><strong>Transporteur :</strong></p>
          <p>{{ stepStore.getLivraisonDetails?.transporter.name }}</p>
          <p>
            Frais :
            {{ stepStore.getLivraisonDetails?.transporter.price }}
            {{ stepStore.getLivraisonDetails?.transporter.currency }}
          </p>
          <p>
            Livraison en {{ stepStore.getLivraisonDetails?.transporter.estimated_delivery_time }}
          </p>
        </div>

        <Button
          type="button"
          variant="link"
          class="text-primary underline p-0 text-[14px] mt-2"
          @click="props.GoToStep(1)"
          >Modifier <span class="sr-only">le choix du transporteur</span></Button
        >
      </div>
    </div>
  </div> -->
</template>
