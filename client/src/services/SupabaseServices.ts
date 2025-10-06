import { supabase } from '@/utils/supabase'
import type { CartType, InsertCartProduct } from '@/types/Cart'
import { Category } from '@/models/Category'

export async function sendMagicLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({ email })
  if (error) {
    throw new Error(error.message)
  }
}

export async function getUserProfile(userId: string) {
  const { data, error, status } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single()

  if (error && status !== 406) throw error

  return { data, error, status }
}

export async function updateProfileService(userId: string, userName: string): Promise<void> {
  const updates = {
    id: userId,
    username: userName,
    updated_at: new Date(),
  }
  const { error } = await supabase.from('profiles').upsert(updates)
  if (error) throw error
}

export async function signOutService(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function inserCartService(userId: string, product_list: CartType) {
  // Check if user exist
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error('Utilisateur non trouvé')
  }

  // Create cart associated to that user
  const { data: newCart, error: errorCart } = await supabase
    .from('carts')
    .insert({ user_id: userId, status: 'submitted' })
    .select('id')
    .single()
  if (errorCart) throw errorCart

  const cartId = newCart.id

  // Insert products in that new cart
  if (!product_list.products) throw new Error('Aucun produit à insérer')
  const cart_products: InsertCartProduct[] = product_list.products.map((product) => ({
    cart_id: cartId,
    product_id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    quantity: product.quantity!,
  }))

  const { error } = await supabase.from('cart_products').insert(cart_products)
  if (error) throw error
}

export async function getLastCartDetail(userId: string): Promise<CartType> {
  if (typeof userId !== 'string') {
    throw new Error('userId est invalide ou non défini.')
  }

  const { data, error } = await supabase
    .from('carts')
    .select(
      `
    id,
    status,
    created_at,
    cart_products (
      id,
      product_id,
      title,
      price,
      quantity,
      image,
      category,
      description
    )
  `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return {
    cart_id: data.id,
    status: data.status,
    products: data.cart_products,
  }
}
