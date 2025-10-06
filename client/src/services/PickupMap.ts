import type { FeatureCollection, Pickup } from '@/types/pickup'
const BASE_URL = '/data/pickup.json'

export async function fetchMarkersData(): Promise<FeatureCollection> {
  const response = await fetch(BASE_URL)
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des modes de livraison')
  }
  return await response.json()
}

export async function getMarkersData(): Promise<Pickup[]> {
  const markers = (await fetchMarkersData()).features
  return markers
}
