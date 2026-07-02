import type {
  productAdd,
  productApiResponse,
  productCreateApi,
  productDelete,
  productForm,
  productUpdateApi,
} from "@shared/types/Product";
import { supabase } from "@/utils/supabase";

export async function addProduct(
  product: productCreateApi,
): Promise<{ message: string; data: productApiResponse }> {
  const { data, error } = await supabase.functions.invoke<{
    message: string;
    data: productApiResponse;
  }>(
    "products-create",
    {
      body: product,
      method: "POST",
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

export async function deleteProduct(
  product: productDelete,
): Promise<{ message: string; data: { id: number } }> {
  const { data, error } = await supabase.functions.invoke<{
    message: string;
    data: { id: number };
  }>(
    `products-delete?id=${product.id}`,
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

export async function updateProduct(
  product: productUpdateApi,
): Promise<{ message: string; data: productApiResponse }> {
  const { data, error } = await supabase.functions.invoke<
    { message: string; data: productApiResponse }
  >("products-update", {
    body: product,
    method: "PATCH",
  });
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("No data returned");
  }
  return data;
}
