import type { CartBackEndType, Order } from "@shared/types/Cart";
import { supabase } from "@/utils/supabase";

export async function addOrder(order: CartBackEndType): Promise<Order> {
  const { data, error } = await supabase.functions.invoke<Order>(
    "order-create",
    {
      method: "POST",
      body: order,
    },
  );
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("No data returned");
  }
  return data;
}
