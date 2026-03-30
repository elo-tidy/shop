<script lang="ts" setup>
import { ref } from 'vue'
// Types
import { productAddSchema, type productAdd } from '@/types/Product'
// UI
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldError,
  FieldContent,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
// Components
import ProductCard from '@/components/modules/product/ProductItem.vue'
// Api
import { addProduct, updateProduct } from '@/api/products'
// Store
import { useProductStore } from '@/store/ProductStore'

// Props
const props = defineProps<{
  id?: productAdd['id']
}>()

// Data
const addProductForm = ref()
const storedProduct = useProductStore()
const productToEdit: productAdd = props.id ? storedProduct.getProductById(props.id) : null
// const currentSessionIsAdmin = useIsUserAdmin()
const dataReq = ref()
const productStore = useProductStore()
const archivedDefaultValue = productToEdit?.archived ? 'archived-true' : 'archived-false'

// Wordings
const labels = productToEdit
  ? {
      pageTitle: `Modifier le produit ${productToEdit.title}`,
      submitTitle: 'Modifier',
      previewTitle: 'Modifié',
    }
  : {
      pageTitle: 'Ajouter un produit au catalogue',
      submitTitle: 'Ajouter',
      previewTitle: 'ajouté',
    }

// Submit form
const { handleSubmit, resetForm } = useForm<productAdd>({
  validationSchema: toTypedSchema(productAddSchema),
  initialValues: {
    // id: productToEdit?.id ?? 0,
    title: productToEdit?.title ?? '',
    price: productToEdit?.price ?? '',
    description: productToEdit?.description ?? '',
    image: productToEdit?.image ?? '',
    category: productToEdit?.category ?? undefined,
    archived: productToEdit?.archived ?? false,
    stock: productToEdit?.stock ?? 0,
  },
})
const onSubmit = handleSubmit(async (data) => {
  try {
    if (productToEdit) {
      // update product
      const req = await updateProduct({ id: productToEdit.id, stock: productToEdit.stock, ...data })
      dataReq.value = req
      productStore.updateProductInStore(req.data)
      toast(`Produit "${req.data.title}" modifié avec succès`)
    } else {
      // add product
      const req = await addProduct(data)
      dataReq.value = req
      productStore.addProductToStore(dataReq.value.data)
      toast('Produit ajouté au catalogue avec succès')
      resetForm()
    }
  } catch (err) {
    console.error(err)
  }
})
</script>
<template v-if="currentSessionIsAdmin">
  <div class="grid gap-10 grid-cols-2">
    <div>
      <div class="flex max-w-xl justify-between gap-x-4">
        <h1 class="mb-5 text-[23px]">{{ labels.pageTitle }}</h1>
        <p>
          <Button asChild>
            <RouterLink class="btn-icon bg-primary mb-4" :to="{ name: 'admin' }">
              <span>Retour au catalogue</span>
            </RouterLink>
          </Button>
        </p>
      </div>
      <div class="grid gap-y-10 max-w-[550px]">
        <Card class="px-6">
          <form ref="addProductForm" id="add-product" @submit="onSubmit">
            <FieldSet>
              <FieldLegend variant="label" class="mb-5 text-[23px] sr-only">
                Formulaire d'ajout du produit au catalogue
              </FieldLegend>
              <FieldGroup>
                <!-- <VeeField v-slot="{ field, errors }" name="id"> -->
                <!-- <Field v-if="productToEdit?.id" :data-invalid="!!errors.length"> -->
                <Field v-if="productToEdit?.id">
                  <FieldLabel for="id">Id</FieldLabel>
                  <Input
                    id="id"
                    class="inputField"
                    type="number"
                    :default-value="productToEdit.id"
                    readonly
                    disabled
                  />
                </Field>

                <VeeField v-slot="{ field, errors }" name="title">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="title">Intitulé</FieldLabel>
                    <Input
                      id="title"
                      v-bind="field"
                      class="inputField"
                      type="text"
                      :default-value="field.value"
                      :aria-invalid="!!errors.length"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ field, errors }" name="description">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="description">Description </FieldLabel>
                    <Textarea
                      id="description"
                      v-bind="field"
                      :default-value="field.value"
                      :aria-invalid="!!errors.length"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ field, errors }" name="price">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="price">Prix </FieldLabel>
                    <Input
                      id="price"
                      v-bind="field"
                      :default-value="field.value"
                      class="inputField"
                      type="number"
                      step="0.01"
                      min="0"
                      :aria-invalid="!!errors.length"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ field, errors }" name="category">
                  <Field :data-invalid="!!errors.length">
                    <FieldContent>
                      <FieldLabel for="category">Catégorie</FieldLabel>
                    </FieldContent>
                    <Select
                      :name="field.name"
                      :model-value="field.value"
                      :default-value="field.value"
                      @update:model-value="field.onChange"
                    >
                      <SelectTrigger id="category" :aria-invalid="!!errors.length">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">electronics </SelectItem>
                        <SelectItem value="jewelery">jewelery </SelectItem>
                        <SelectItem value="mens clothing">mens clothing </SelectItem>
                        <SelectItem value="womens clothing">womens clothing </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ field, errors }" name="image">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="image">Url de l'image </FieldLabel>
                    <Input
                      id="image"
                      v-bind="field"
                      :default-value="field.value"
                      class="inputField"
                      type="text"
                      :aria-invalid="!!errors.length"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ field, errors }" name="stock">
                  <Field :data-invalid="!!errors.length">
                    <FieldLabel for="stock">Stock </FieldLabel>
                    <Input
                      id="stock"
                      v-bind="field"
                      :default-value="field.value"
                      class="inputField"
                      type="number"
                      step="1"
                      min="0"
                      :aria-invalid="!!errors.length"
                    />
                    <FieldError
                      v-if="errors.length"
                      :errors="errors.map((e) => ({ message: e }))"
                    />
                  </Field>
                </VeeField>

                <VeeField v-if="productToEdit?.id" v-slot="{ field, errors }" name="archived">
                  <FieldSet>
                    <FieldLegend>Produit archivé</FieldLegend>

                    <RadioGroup
                      :model-value="field.value"
                      @update:model-value="field.onChange"
                      class="grid grid-cols-[auto_auto] justify-start"
                    >
                      <FieldLabel>
                        <Field orientation="horizontal" :data-invalid="!!errors.length">
                          <FieldContent>
                            <FieldTitle>Oui</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            id="archived-true"
                            :value="true"
                            :aria-invalid="!!errors.length"
                          />
                        </Field>
                      </FieldLabel>

                      <FieldLabel>
                        <Field orientation="horizontal" :data-invalid="!!errors.length">
                          <FieldContent>
                            <FieldTitle>Non</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            id="archived-false"
                            :value="false"
                            :aria-invalid="!!errors.length"
                          />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>

                    <FieldError v-if="errors.length" :errors="errors" />
                  </FieldSet>
                </VeeField>

                <Field class="grid w-full gap-4 mb-4 justify-end">
                  <input
                    type="submit"
                    class="button"
                    :value="labels.submitTitle"
                    form="add-product"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </Card>
      </div>
    </div>
    <div v-if="dataReq">
      <h2 class="mb-5 text-[23px]">Visuel du produit précédemment {{ labels.previewTitle }} :</h2>
      <ProductCard :product="dataReq.data" display="card" :displayFooter="false" :hn="3" />
    </div>
  </div>
</template>
