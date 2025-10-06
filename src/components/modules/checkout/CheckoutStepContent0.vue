<script lang="ts" setup>
//Ui
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
</script>
<template>
  <Form @submit.prevent="">
    <fieldset>
      <legend>Mes coordonnées</legend>
      <FormField name="nom">
        <FormItem class="grid w-full gap-4 mb-4">
          <FormLabel>Nom</FormLabel>
          <FormControl>
            <Input class="inputField" placeholder="Studio" type="text" disabled />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="adresse">
        <FormItem class="grid w-full gap-4 mb-4">
          <FormLabel>Adresse</FormLabel>
          <FormControl>
            <Input class="inputField" placeholder="Rue Saint-Honoré" type="text" disabled />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="cp">
        <FormItem class="grid w-full gap-4 mb-4">
          <FormLabel>Code Postal</FormLabel>
          <FormControl>
            <Input class="inputField" placeholder="75001" type="number" disabled />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="ville">
        <FormItem class="grid w-full gap-4 mb-4">
          <FormLabel>Ville</FormLabel>
          <FormControl>
            <Input class="inputField" placeholder="Paris" type="text" disabled />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="pays">
        <FormItem class="grid w-full gap-4 mb-4">
          <FormLabel>Pays</FormLabel>
          <FormControl>
            <Input class="inputField" placeholder="France" type="text" disabled />
          </FormControl>
        </FormItem>
      </FormField>
      <FormItem class="grid w-full gap-4 mb-4 justify-end">
        <input
          type="submit"
          class="button"
          value="Mettre à jour mon adresse de livraison"
          disabled
        />
      </FormItem>
    </fieldset>
  </Form>
</template>
