import type { cartProduct, CartType} from '@/types/Cart'
export class Cart {

  constructor(private cart: CartType) {} 

  get data(): CartType { 
    return this.cart 
  }

  get id() {
    return this.cart.id
  }

  get products() {
    return this.cart.products
  }

  
  get totalNumberOfItem(): number {
    return this.cart.products.reduce((totalItems:number, product: cartProduct) => {
      return totalItems + (product.quantity ?? 0)
    }, 0)
  }

  get totalPrice(): number{
    return this.cart.products.reduce((totalPrice:number, product: cartProduct) => {
      return Math.round((totalPrice + (product.quantity ?? 0) * product.price) * 100) / 100
    }, 0) 
  }

  getProduct(productId: number) {
    return this.cart.products.find(p => p.id === productId)
  }


  getItemQuantity(productId: number): cartProduct['quantity']  {
    const product = this.getProduct(productId)
    return product?.quantity ?? 0
  }    

  getItemArchivedStatus(productId: number): cartProduct['archived']  {
    const product = this.getProduct(productId)
    return product?.archived ?? false
  }  

  addItemToCart(product: cartProduct, itemQuantity: number) {
    if (itemQuantity <= 0) return
    const existingProduct = this.getProduct(product.id)

    if (!existingProduct) {
      this.cart.products.push({ ...product, quantity: itemQuantity })
      return
    }
     existingProduct.quantity += itemQuantity
  }

  deleteItemFromCart(productId: cartProduct['id']){
    const index = this.cart.products.findIndex(p => p.id === productId)
    if (index !== -1) this.cart.products.splice(index, 1)
  }

  updateItemQuantity(productId: number, addOrRemove: 'add' | 'remove') {
    addOrRemove === 'add'
      ? this.increaseQuantity(productId)
      : this.decreaseQuantity(productId)
  }

  increaseQuantity(productId: number) {
    const product = this.getProduct(productId)
    if (!product) return
    product.quantity = (product.quantity ?? 0) + 1
  }

  decreaseQuantity(productId: number) {
    const product = this.getProduct(productId)
    if(!product) return
    product.quantity = Math.max((product.quantity ?? 0) - 1, 0)
  }
  clearCart() {
    this.cart.products.splice(0)
  }

 
}
