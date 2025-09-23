import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/utils/supabase'
import type { Session } from '@supabase/supabase-js'

const session = ref<Session | null>(null)

export function useSupabaseSession() {
  let unsubscribe: () => void
  onMounted(async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    session.value = sessionData.session

    const { data: stateData } = await supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
    unsubscribe = stateData.subscription.unsubscribe
  })
  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })
  return { session }
}
