import type {productForm, productDelete} from '@/types/Product'
import { supabase } from '@/utils/supabase'

export async function addProduct(product:productForm) {
  const { data, error } = await supabase.functions.invoke("products-create", {
    body: product,
    method: 'POST'
  })
  if (error) {
    throw error
  }
  return data
}

export async function deleteProduct(product:productDelete) {
  const { data, error } = await supabase.functions.invoke(`products-delete?id=${product.id}`, {
    method: "DELETE",
  })
  if (error) {
    throw error
  }
  return data 
}

export async function updateProduct(product:productForm) {
  const { data, error } = await supabase.functions.invoke("products-update", {
    body: product,
    method: 'PATCH'
  })
  if (error) {
    throw error
  }
  return data
}