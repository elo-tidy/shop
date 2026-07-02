import type { CartBackEndType } from "@shared/types/Cart";
import type { Order, orderDelete } from "@shared/types/Order";
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

export async function deleteOrderApi(
  order: orderDelete,
): Promise<{ message: string; data: { id: string } }> {
  const { data, error } = await supabase.functions.invoke<{
    message: string;
    data: { id: string };
  }>(
    `order-delete?id=${order.id}`,
    {
      method: "DELETE",
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
