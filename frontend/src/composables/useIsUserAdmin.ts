import { ref, watch } from 'vue'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { isAdmin } from '../../../shared/services/SupabaseServices'

const currentSessionIsAdmin = ref(false)
const isLoaded = ref(false)
let initialized = false

export function useIsUserAdmin() {
  const { session } = useSupabaseSession()

  const checkAdmin = async () => {
    if (session.value?.user) {
      try {
        currentSessionIsAdmin.value = await isAdmin()
      } catch (err) {
        console.error('Erreur vérification admin', err)
        currentSessionIsAdmin.value = false
      }
    } else {
      currentSessionIsAdmin.value = false
    }
    isLoaded.value = true
  }

  if (!initialized) {
    watch(
      session,
      async (newSession, oldSession) => {
        if (newSession?.user?.id !== oldSession?.user?.id) {
          isLoaded.value = false
          await checkAdmin()
        }
      },
      { immediate: true }
    )
    initialized = true
  }

  return { currentSessionIsAdmin, isLoaded, checkAdmin }
}