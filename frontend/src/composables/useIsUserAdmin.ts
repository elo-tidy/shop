import { ref } from "vue";
// Services
import { isAdmin } from "@shared/services/SupabaseServices";
// Utils
import { supabase } from "@/utils/supabase";

const currentSessionIsAdmin = ref(false);
const isLoaded = ref(false);
let initPromise: Promise<boolean> | null = null;
let initialized = false;

export function useIsUserAdmin() {
  const checkAdmin = async (): Promise<boolean> => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      currentSessionIsAdmin.value = false;
      return false;
    }

    try {
      const req = await isAdmin();
      currentSessionIsAdmin.value = req;
      return req;
    } catch {
      currentSessionIsAdmin.value = false;
      return false;
    }
  };

  const init = () => {
    if (!initPromise) {
      initPromise = checkAdmin();
    }
    return initPromise;
  };

  /*if (!initialized) {
    watch(
      session,
      async (newSession, oldSession) => {
        if (newSession?.user?.id !== oldSession?.user?.id) {
          isLoaded.value = false;
          await checkAdmin();
        }
      },
      { immediate: true },
    );
    initialized = true;
  }*/

  return { currentSessionIsAdmin, isLoaded, checkAdmin, init };
}
