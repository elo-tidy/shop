/*const BASE_URL = 'https://fakestoreapi.com'

export async function fetchAllProducts() {
  const response = await fetch(`${BASE_URL}/products`)
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des produits')
  }
  return await response.json()
}

export async function fetchAllProductCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`)
  if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
  return await response.json()
}*/

import { supabase } from "@/utils/supabase";
import {
  type productCatalog,
  productCatalogSchema,
} from "@shared/types/Product";
import type { CartType } from "@shared/types/Cart";
import type { Database } from "@shared/types/database";

export async function fetchAllProducts(): Promise<productCatalog[]> {
  const { data, error } = await supabase
    .from("products")
    // .select('*')
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
