import type { ShippingMode, Transporter, DeliveryMode } from '@/types/ShippingMode'
const BASE_URL = '/data/shipping-options.json'

export async function fetchShippingOptions(): Promise<ShippingMode> {
  const response = await fetch(BASE_URL)
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des modes de livraison')
  }
  return await response.json()
}

export async function getTransporterDetails(
  shippingData: DeliveryMode[],
  carrierId: string,
): Promise<{ transporter: Transporter; deliveryMode: string; deliveryModeId: string } | null> {
  for (const mode of shippingData) {
    const transporter = mode.transporters.find((transporter) => transporter.id === carrierId)
    if (transporter) return { transporter, deliveryMode: mode.name, deliveryModeId: mode.id }
  }
  return null
}
