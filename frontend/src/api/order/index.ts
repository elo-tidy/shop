import type {CartBackEndType} from '../../../../shared/types/Cart'
import { supabase } from '@/utils/supabase'


export async function addOrder(order:CartBackEndType) {
  const { data, error } = await supabase.functions.invoke("order-create", {
    method: 'POST',
    body: order
  })
  if (error) {
    throw error
  }
  console.log("api order data", data)
  return data
}