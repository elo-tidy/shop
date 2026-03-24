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
import {productAddSchema, type productAdd} from '@/types/Product'
import type {Database} from'@/types/database'

export async function fetchAllProducts() : Promise<productAdd>{
  const { data, error } = await supabase
    .from('products')
    .select()
  if (error) {
    throw new Error('Erreur lors du chargement des produits')
  }
  return data
  
}

export async function fetchAllProductCategories() : Promise<Database['public']['Enums']['categories'][]> {
  const { data, error } = await supabase.rpc('get_products_categories');
   if (error) {
    throw new Error('Erreur lors du chargement des catégories')
  }
  return data
}
