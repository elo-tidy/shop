export interface Transporter {
  id: string
  name: string
  price: number
  currency: string
  estimated_delivery_time: string
}

export interface DeliveryMode {
  id: string
  name: string
  description: string
  transporters: Transporter[]
}

export interface ShippingMode {
  delivery_modes: DeliveryMode[]
}

export interface DeliveryDetailsWrapper extends ShippingMode {
  transporter: Transporter
}
export interface DeliveryDetails {
  transporter: Transporter
  deliveryMode: string // nom du mode choisi
  deliveryModeId: string // id du mode choisi
}
