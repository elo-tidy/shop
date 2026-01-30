<script lang="ts" setup>
//Ui
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>
<template>
  <form>
    <FieldSet>
      <FieldLegend variant="label">Mes coordonnées</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel for="nom">Nom </FieldLabel>
          <Input id="nom" class="inputField" placeholder="Studio" type="text" disabled />
        </Field>
        <Field>
          <FieldLabel for="address">Adresse </FieldLabel>
          <Input
            id="address"
            class="inputField"
            placeholder="Rue Saint-Honoré"
            type="text"
            disabled
          />
        </Field>
        <Field>
          <FieldLabel for="cp">Code postal </FieldLabel>
          <Input id="cp" class="inputField" placeholder="75001" type="number" disabled />
        </Field>
        <Field>
          <FieldLabel for="city">Ville </FieldLabel>
          <Input id="city" class="inputField" placeholder="Paris" type="text" disabled />
        </Field>
        <Field>
          <FieldLabel for="country">Pays </FieldLabel>
          <Input id="country" class="inputField" placeholder="France" type="text" disabled />
        </Field>
        <Field class="grid w-full gap-4 mb-4 justify-end">
          <input
            type="submit"
            class="button"
            value="Mettre à jour mon adresse de livraison"
            disabled
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  </form>
</template>
