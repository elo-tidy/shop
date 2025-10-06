export class Category {
  name: string
  slug: string

  constructor(name: string) {
    this.name = name
    this.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '-')
  }
}
