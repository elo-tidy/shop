import { z } from "zod";
import { cartSchema } from "@shared/types/Cart.ts";
import { paymentStatusEnumSchema } from "@shared/types/PaymentStatus.ts";

// Frontend
export const orderSchema = z.object({
    id: z.string().optional(),

    cart_id: z.string().optional(),
    user_id: z.string().optional(),

    total_price: z.number(),
    products_price: z.number(),

    payment_status: paymentStatusEnumSchema,
    payment_method: z.string(),
    payment_ID: z.string().nullable().optional(),
    stripe_event_id: z.string().nullable().optional(),

    delivery_status: z.string().nullable().optional(),
    delivery_price: z.number(),
    delivery_carrier: z.string(),
    delivery_date: z.string(),

    created_at: z.string(),
    updated_at: z.string().nullable().optional(),

    cart: cartSchema,
});
export type Order = z.infer<typeof orderSchema>;

export const orderDeleteSchema = z.object({
    id: z.string(),
});
export type orderDelete = z.infer<typeof orderDeleteSchema>;

// Backend
export const orderBackEndSchema = z.object({
    id: z.string(),

    cart_id: z.string(),
    user_id: z.string(),

    total_price: z.number(),
    products_price: z.number(),

    payment_status: paymentStatusEnumSchema,
    payment_method: z.string(),
    payment_ID: z.string().nullable(),
    stripe_event_id: z.string().nullable().optional(),

    delivery_status: z.string().nullable(),
    delivery_price: z.number(),
    delivery_carrier: z.string(),
    delivery_date: z.string(),

    created_at: z.string(),
    updated_at: z.string().nullable(),

    cart: z.object({
        id: z.string(),

        products: z.array(
            z.object({
                id: z.string(),

                cart_id: z.string(),
                product_id: z.number(),

                title: z.string().nullable(),
                price: z.number(),
                quantity: z.number(),

                description: z.string().nullable(),
                image: z.string().nullable(),
                category: z.string().nullable(),

                products: z
                    .object({
                        stock: z.object({
                            quantity: z.number().nullable(),
                        })
                            .nullable(),
                    })
                    .optional(),
            }),
        ),
    }),
});
export type OrderDb = z.infer<typeof orderBackEndSchema>;
