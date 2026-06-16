// import { z } from "https://esm.sh/zod@4.1.11";
import { z } from "zod";
import { categoryEnum } from "../types/Categories.ts";

// Frontend
export const productCatalogSchema = z.object({
  id: z.number().min(0, "L'id doit être positif"),
  title: z.string(),
  price: z.number()
    .refine((val: number) => val > 0, {
      message: "Le prix est obligatoire",
    })
    .min(0, "Le prix doit être positif"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  category: z.union([
    z.enum(["electronics", "jewelery", "mens clothing", "womens clothing"]),
    z.undefined(),
  ]).optional(),
  stock: z.number().min(0).default(0),
  archived: z.boolean().nullable().optional(),
});
export type productCatalog = z.infer<typeof productCatalogSchema>;
export const productFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Titre obligatoire"),
  price: z.number().min(0),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  category: categoryEnum.optional(),
  stock: z.number().min(0),
  archived: z.boolean().optional(),
});
export type productForm = z.infer<typeof productFormSchema>;

// Backend
export const productAddSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Le titre est obligatoire"),
  price: z.number()
    .refine((val: number) => val > 0, {
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
    z.undefined(),
  ]).refine((val: unknown) => val !== undefined, {
    message: "La catégorie est obligatoire",
  }),
  archived: z.boolean().optional(),
  stock: z.number().min(0),
  // product_stock:  z.object({
  //   quantity: z.number().min(0, "La quantité doit être renseignée")
  // })
});
export type productAdd = z.infer<typeof productAddSchema>;

// Common
export const productDeleteSchema = z.object({
  id: z.number().min(1, "L'id du produit est obligatoire"),
});
export type productDelete = z.infer<typeof productDeleteSchema>;
