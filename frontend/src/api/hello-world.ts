import { supabase } from '../utils/supabase'

export async function callHelloWorld(name: string) {
  const { data, error } = await supabase.functions.invoke('hello-world', {
    method: 'POST',
    body: { name },
  })

  if (error) {
    console.error('Erreur hello-world:', error)
    return null
  }

  return data
}
