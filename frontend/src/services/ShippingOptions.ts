import type { ShippingMode } from '@/types/ShippingMode'
const BASE_URL = '/data/shipping-options.json'

export async function fetchShippingOptions(): Promise<ShippingMode> {
  const response = await fetch(BASE_URL)
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des modes de livraison')
  }
  return await response.json()
}
