import { z } from "zod";
import type {CartProduct} from "../types/Cart"

export function (products: CartProduct[]): number {
  return products.reduce((total, p) => total + p.price * p.quantity, 0);
}