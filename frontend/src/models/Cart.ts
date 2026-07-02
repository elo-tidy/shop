import type { cartProduct, CartType } from "@shared/types/Cart";
import type { productCatalog } from "@shared/types/Product";
export class Cart {
  constructor(private cart: CartType) {}

  get data(): CartType {
    return this.cart;
  }

  get id(): CartType["id"] {
    return this.cart.id;
  }

  get products(): cartProduct[] {
    return this.cart.products;
  }

  get totalNumberOfItem(): number {
    return this.cart.products.reduce(
      (totalItems: number, product: cartProduct) => {
        return totalItems + (product.quantity ?? 0);
      },
      0,
    );
  }

  get totalPrice(): number {
    return this.cart.products.reduce(
      (totalPrice: number, product: cartProduct) => {
        return Math.round(
          (totalPrice + product.quantity * product.price) * 100,
        ) / 100;
      },
      0,
    );
  }

  getProduct(productId: number): cartProduct | undefined {
    return this.cart.products.find((p: cartProduct) => p.id === productId);
  }

  getItemQuantity(productId: number): cartProduct["quantity"] {
    const product = this.getProduct(productId);
    if (!product) throw new Error("Product not found");
    return product.quantity;
  }

  addItemToCart(product: cartProduct, itemQuantity: number): void {
    if (itemQuantity <= 0) return;
    const existingProduct = this.getProduct(product.id);

    if (!existingProduct) {
      this.cart.products.push({ ...product, quantity: itemQuantity });
      return;
    }
    existingProduct.quantity += itemQuantity;
  }

  deleteItemFromCart(productId: cartProduct["id"]): void {
    const index = this.cart.products.findIndex((p: cartProduct) =>
      p.id === productId
    );
    if (index !== -1) this.cart.products.splice(index, 1);
  }

  updateItemQuantity(
    productId: cartProduct["id"],
    addOrRemove: "add" | "remove",
  ): void {
    addOrRemove === "add"
      ? this.increaseQuantity(productId)
      : this.decreaseQuantity(productId);
  }

  increaseQuantity(productId: cartProduct["id"]): void {
    const product = this.getProduct(productId);
    if (!product) return;
    product.quantity = product.quantity + 1;
  }

  decreaseQuantity(productId: cartProduct["id"]): void {
    const product = this.getProduct(productId);
    if (!product) return;
    product.quantity = Math.max(product.quantity - 1, 0);
  }
  clearCart(): void {
    this.cart.products.splice(0);
  }
}
