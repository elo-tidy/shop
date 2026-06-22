import { supabase } from "@/utils/supabase";

export async function getAdminDashboard() {
    const { data, error } = await supabase.functions.invoke("admin-tools-get", {
        method: "GET",
    });
    if (error) {
        throw error;
    }
    return data;
}
