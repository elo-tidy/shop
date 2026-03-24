// import { z } from 'zod'
import { z } from "https://esm.sh/zod@4.1.11";

// Add product
export const productAddSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Le titre est obligatoire"),
  price: z.number()
    .refine((val:number) => val > 0, {
      message: "Le prix est obligatoire",
    })
    .min(0, "Le prix doit être positif"),
  description: z.string().min(1, "La description est obligatoire"),
 image: z.string()
  .min(1, "L'url de l'image est obligatoire")
  .pipe(z.string().url("L'url est invalide")),
  // category: z.string().min(1, "La catégorie est obligatoire"),
  category: z.union([
    z.enum(["electronics", "jewelery", "mens clothing", "womens clothing"]),
    z.undefined()
  ]).refine((val:unknown) => val !== undefined, {
    message: "La catégorie est obligatoire"
  }),
  archived: z.boolean().optional()
})
export type productAdd = z.infer<typeof productAddSchema>

// Delete product
export const productDeleteSchema = z.object({
  id: z.number().min(1, "L'id du produit est obligatoire"),
});
export type productDelete = z.infer<typeof productDeleteSchema>;