// Types
import type { Database } from "@shop/shared/types/database";
import type { productCatalog } from "@shop/shared/types/Product";
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
  if (!data) {
    throw new Error("No data returned");
  }
  // extract stock within item
  const mappedData = data.map((item) => {
    const stock = item.product_stock?.quantity ?? 0;
    const { product_stock, ...rest } = item;

    return {
      ...rest,
      stock,
    };
  });
  return mappedData;
}

export async function fetchProduct(
  id: number,
): Promise<productCatalog> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_stock!product_stock_product_id_fkey(quantity)
    `)
    .eq("id", id);
  if (error) {
    throw new Error("Erreur lors du chargement du produit");
  }
  if (!data) {
    throw new Error("No data returned");
  }
  // extract stock within item
  const mappedData = data.map((item) => {
    const stock = item.product_stock?.quantity ?? 0;
    const { product_stock, ...rest } = item;

    return {
      ...rest,
      stock,
    };
  });
  return mappedData[0];
}

export async function fetchAllProductCategories(): Promise<
  Database["public"]["Enums"]["categories"][]
> {
  const { data, error } = await supabase.rpc("get_products_categories");
  if (error) {
    throw new Error("Erreur lors du chargement des catégories");
  }
  return data as Database["public"]["Enums"]["categories"][];
}

export function subscribeCatalogChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel("catalog-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      callback,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "product_stock" },
      callback,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
