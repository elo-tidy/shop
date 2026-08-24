import { ref } from "vue";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const session = ref<Session | null>(null);
const isLoaded = ref(false);

let initialized = false;
let unsubscribe: (() => void) | null = null;

async function initSession() {
  if (initialized) {
    return;
  }

  initialized = true;

  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession();

  session.value = currentSession;
  isLoaded.value = true;

  const { data } = supabase.auth.onAuthStateChange(
    (_event, newSession) => {
      session.value = newSession;
    },
  );

  unsubscribe = data.subscription.unsubscribe;
}

export function useSupabaseSession() {
  initSession();

  return {
    session,
    isLoaded,
  };
}
