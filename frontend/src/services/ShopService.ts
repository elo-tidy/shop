// Types
import type { Database } from "@shared/types/database";
import type { productCatalog } from "@shared/types/Product";
// utils
import { supabase } from "@/utils/supabase";

export async function fetchAllProducts(): Promise<productCatalog[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_stock!product_stock_product_id_fkey(quantity)
    `);
  if (error) {
    throw new Error("Erreur lors du chargement des produits");
  }
  // extract stock within item
  const mappedData = data.map((item) => ({
    ...item,
    stock: item.product_stock?.quantity ?? 0,
  })).map(({ product_stock, ...rest }) => rest);

  return mappedData;
}

export async function fetchAllProductCategories(): Promise<
  Database["public"]["Enums"]["categories"][]
> {
  const { data, error } = await supabase.rpc("get_products_categories");
  if (error) {
    throw new Error("Erreur lors du chargement des catégories");
  }
  return (data ?? []) as Database["public"]["Enums"]["categories"][];
}
