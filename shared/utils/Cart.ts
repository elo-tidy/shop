import { z } from "zod";
import type { cartProduct } from "../types/Cart.ts";
import { numberWithTwoDecimals } from "./maths.ts";

export function calculateProductsPrice(products: cartProduct[]): number {
  return numberWithTwoDecimals(
    products.reduce((total, p) => total + p.price * p.quantity, 0),
  );
}

// Calcul prix total avec livraison
export function calculateTotalPrice(
  products: cartProduct[],
  delivery?: { delivery_price: number },
): number {
  const productsPrice = calculateProductsPrice(products);
  const deliveryPrice = delivery?.delivery_price ?? 0;
  return numberWithTwoDecimals(Number(productsPrice) + Number(deliveryPrice));
}
