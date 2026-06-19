import type { CartBackEndType } from "@shared/types/Cart";
import type { Order } from "@shared/types/Cart";
import { supabase } from "@/utils/supabase";

export async function addOrder(order: CartBackEndType) {
  console.log("order", order);
  const { data, error } = await supabase.functions.invoke("order-create", {
    method: "POST",
    body: order,
  });
  if (error) {
    throw error;
  }
  return data;
}
