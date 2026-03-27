import { z } from "https://esm.sh/zod@4.1.11";

// Transporter
const transporterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom du transporteur requis"),
  price: z.number().min(0, "Le prix doit être positif"),
  currency: z.string().min(1, "Devise requise"),
  estimated_delivery_time: z.string().min(1, "Délai requis"),
})
export type Transporter = z.infer<typeof transporterSchema>

// Delivery Mode
const deliveryModeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Mode de livraison requis"),
  description: z.string().min(1, "Description du mode de livraison requise"),
  transporters: z.array(transporterSchema),
})
export type DeliveryMode = z.infer<typeof deliveryModeSchema>

// Shipping mode
const shippingModeSchema = z.object({
  delivery_modes: z.array(deliveryModeSchema),
})
export type ShippingMode = z.infer<typeof shippingModeSchema>

// Delivery detail
const deliveryDetailsWrapperSchema = shippingModeSchema.extend({
  transporter: transporterSchema,
})
export type DeliveryDetailsWrapper = z.infer<typeof deliveryDetailsWrapperSchema>

const deliveryDetailsSchema = z.object({
  transporter: transporterSchema,
  deliveryMode: z.string().min(1, "Mode de livraison requis"),
  deliveryModeId: z.string().min(1, "ID du mode de livraison requis"),
})
export type DeliveryDetails = z.infer<typeof deliveryDetailsSchema>
