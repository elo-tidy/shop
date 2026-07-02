// Types
import type { productCatalog } from "@shared/types/Product";
export class Product {
  private data: productCatalog;

  constructor(data: productCatalog) {
    this.data = data;
  }

  get id(): productCatalog["id"] {
    return this.data.id;
  }

  get title(): productCatalog["title"] {
    return this.data.title;
  }

  get price(): productCatalog["price"] {
    return this.data.price;
  }

  get description(): productCatalog["description"] {
    return this.data.description ?? "";
  }

  get image(): productCatalog["image"] {
    return this.data.image ?? "";
  }

  get category(): productCatalog["category"] {
    return this.data.category;
  }

  get stock(): productCatalog["stock"] {
    return this.data.stock;
  }

  get archived(): productCatalog["archived"] {
    return this.data.archived ?? false;
  }

  get formattedPrice(): string {
    return `${this.price.toFixed(2)} €`;
  }

  get shortTitle(): productCatalog["title"] {
    return this.title.length > 40 ? this.title.slice(0, 37) + "…" : this.title;
  }

  get shortDesc(): productCatalog["description"] {
    if (!this.description) return "";
    return this.description.length > 100
      ? this.description.slice(0, 97) + "…"
      : this.description;
  }

  get imageAlt(): string {
    return `Image du produit : ${this.title}`;
  }
}
