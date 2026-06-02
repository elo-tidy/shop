import { z } from "npm:zod";
import type {CartProduct} from "../types/Cart.ts"
import {numberWithTwoDecimals} from './maths.ts'

// Calcul du prix des produits
export function calculateProductsPrice(products: CartProduct[]): number {
  return numberWithTwoDecimals(products.reduce((total, p) => total + p.price * p.quantity, 0));
}

// Calcul prix total avec livraison
export function calculateTotalPrice(
  products: CartProduct[],
  delivery?: { delivery_price: number }
): number {
  const productsPrice = calculateProductsPrice(products);
  const deliveryPrice = delivery?.delivery_price ?? 0;
  return numberWithTwoDecimals(Number(productsPrice) +  Number(deliveryPrice));
}