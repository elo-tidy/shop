import { supabase } from "@/utils/supabase";

export async function getAdminDashboard(): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke<boolean>(
        "admin-tools-get",
        {
            method: "GET",
        },
    );
    if (error) {
        throw error;
    }
    if (!data) {
        throw new Error("No data returned");
    }
    return data;
}
