<script lang="ts" setup>
// Ui
import { Button } from '@/components/ui/button'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Props
const props = defineProps<{
  GoToStep: (stepNumber: number) => void
}>()
const stepStore = usecheckoutStepper()
</script>
<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-if="stepStore.getLivraisonDetails?.deliveryModeId === 'pickup_point'"
      class="flex flex-col justify-between h-full items-start"
    >
      <p>
        <strong>{{ stepStore.getLivraisonDetails?.deliveryMode }}</strong
        >:
      </p>
      <address>
        Studio <br />
        Rue du <br />
        point relai<br />
        Pays
      </address>

      <Button
        type="button"
        variant="link"
        class="text-primary underline p-0 text-[14px] mt-2"
        @click="props.GoToStep(0)"
        >Modifier <span class="sr-only">adresse de livraison</span></Button
      >
    </div>

    <div v-else class="flex flex-col justify-between h-full items-start">
      <p class="mb-2"><strong>Livraison à domicile</strong> :</p>
      <address>
        Studio <br />
        Rue Saint-Honoré <br />
        75001 Paris<br />
        France
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
        <p class="mb-2"><strong>Transporteur :</strong></p>
        <p>{{ stepStore.getLivraisonDetails?.transporter.name }}</p>
        <p>
          Frais :
          {{ stepStore.getLivraisonDetails?.transporter.price }}
          {{ stepStore.getLivraisonDetails?.transporter.currency }}
        </p>
        <p>Livraison en {{ stepStore.getLivraisonDetails?.transporter.estimated_delivery_time }}</p>
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
