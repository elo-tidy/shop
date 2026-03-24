import type {productAdd, productDelete} from '../../../../shared/types/Product'
import { supabase } from '@/utils/supabase'
// import { useSupabaseSession } from '@/composables/useSupabaseSession'
// import type { Session } from '@supabase/supabase-js'

// const {session} = useSupabaseSession()


export async function addProduct(product:productAdd) {
  const { data, error } = await supabase.functions.invoke("products-create", {
    body: product,
    method: 'POST'
  })
  if (error) {
    throw error
  }
  return data
}

/*
export async function deleteProduct(product:productDelete) {
  // console.log('session',session.value?.access_token)
  const { data, error } = await supabase.functions.invoke("products-delete", {   
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.value?.access_token}`,
      "Accept": "application/json"
    },
    body: product,
    method: 'DELETE'
  })
  if (error) {
    throw error
  }
  return data
}
  */

export async function deleteProduct(product:productDelete) {
  const { data, error } = await supabase.functions.invoke(`products-delete?id=${product.id}`, {
    method: "DELETE",
  })
  if (error) {
    throw error
  }
  return data 
}

export async function updateProduct(product:productAdd) {
  console.log("api", product)
  const { data, error } = await supabase.functions.invoke("products-update", {
    body: product,
    method: 'PATCH'
  })
  if (error) {
    throw error
  }
  return data
}