import { z } from "zod";
import type { cartProduct } from "../types/Cart.ts";
import { numberWithTwoDecimals } from "./maths.ts";

// Total products price
export function calculateProductsPrice(products: cartProduct[]): number {
  return Number(numberWithTwoDecimals(
    products.reduce((total, p) => total + p.price * p.quantity, 0),
  ));
}

// Total order price
export function calculateTotalPrice(
  products: cartProduct[],
  delivery?: { delivery_price: number },
): number {
  const productsPrice = calculateProductsPrice(products);
  const deliveryPrice = delivery?.delivery_price ?? 0;
  return Number(
    numberWithTwoDecimals(Number(productsPrice) + Number(deliveryPrice)),
  );
}
