const BASE_URL = 'https://fakestoreapi.com'

export async function fetchAllProducts() {
  const response = await fetch(`${BASE_URL}/products`)
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des produits')
  }
  return await response.json()
}

export async function fetchAllProductCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`)
  if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
  return await response.json()
}
