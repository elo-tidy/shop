import type { ProductApi } from '@/types/Product'

export class Product {
  private data: ProductApi

  constructor(data: ProductApi) {
    // on conserve la référence réactive directement
    this.data = data
  }

  get id(): number {
    return this.data.id ?? 0
  }

  get title(): string {
    return this.data.title ?? ''
  }

  get price(): number {
    return this.data.price ?? 0
  }

  get description(): string {
    return this.data.description ?? ''
  }

  get image(): string {
    return this.data.image ?? ''
  }

  get category(): string {
    return this.data.category ?? ''
  }

  get quantity(): number {
    return this.data.quantity ?? 0
  }

  get formattedPrice(): string {
    return `${this.price.toFixed(2)} €`
  }

  get shortTitle(): string {
    return this.title.length > 40 ? this.title.slice(0, 37) + '…' : this.title
  }

  get shortDesc(): string {
    return this.description.length > 100 ? this.description.slice(0, 97) + '…' : this.description
  }

  get imageAlt(): string {
    return `Image du produit : ${this.title}`
  }

  get itemQuantity(): number {
    return this.quantity
  }
}
