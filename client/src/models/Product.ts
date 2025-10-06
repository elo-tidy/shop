import type { ProductApi } from '@/types/Product'

export class Product {
  id: number
  title: string
  price: number
  description: string
  image: string
  category: string
  quantity?: number

  constructor(data: ProductApi) {
    this.id = data.id ?? 0
    this.title = data.title ?? ''
    this.price = data.price ?? 0
    this.description = data.description ?? ''
    this.image = data.image ?? ''
    this.category = data.category ?? ''
    this.quantity = data.quantity ?? 0
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
    return this.quantity ?? 0
  }
}
