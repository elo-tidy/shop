import { ref, watch } from "vue";
import { isAdmin } from "@shop/shared/services/SupabaseServices";
import { useSupabaseSession } from "./useSupabaseSession";

const currentSessionIsAdmin = ref(false);
const isLoaded = ref(false);

let initialized = false;
let initPromise: Promise<boolean> | null = null;

export function useIsUserAdmin() {
  const { session } = useSupabaseSession();

  const checkAdmin = async (): Promise<boolean> => {
    if (!session.value?.user) {
      currentSessionIsAdmin.value = false;
      isLoaded.value = true;
      return false;
    }

    isLoaded.value = false;

    try {
      const admin = await isAdmin();

      currentSessionIsAdmin.value = admin;
      return admin;
    } catch {
      currentSessionIsAdmin.value = false;
      return false;
    } finally {
      isLoaded.value = true;
    }
  };

  const init = () => {
    if (!initPromise) {
      initPromise = checkAdmin().finally(() => {
        initPromise = null;
      });
    }

    return initPromise;
  };

  if (!initialized) {
    watch(
      () => session.value?.user?.id ?? null,
      async (userId, oldUserId) => {
        if (userId === oldUserId) {
          return;
        }

        currentSessionIsAdmin.value = false;
        isLoaded.value = false;

        await checkAdmin();
      },
      { immediate: true },
    );

    initialized = true;
  }

  return {
    currentSessionIsAdmin,
    isLoaded,
    checkAdmin,
    init,
  };
}
