import { onMounted, onUnmounted, ref } from "vue";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const session = ref<Session | null>(null);

export function useSupabaseSession() {
  let unsubscribe: () => void;
  onMounted(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    session.value = sessionData.session;

    const { data: stateData } = supabase.auth.onAuthStateChange(
      (_, _session) => {
        session.value = _session;
      },
    );
    unsubscribe = stateData.subscription.unsubscribe;
  });
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
  return { session };
}
