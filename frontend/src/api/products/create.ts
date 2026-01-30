import { supabase } from '@/utils/supabase'

const { data, error } = await supabase.functions.invoke('products-create', {
  body: {
    title: 'Nouveau produit',
    description: 'Description ici',
    price: 100,
    category: 1,
    image: null,
  },
})
