import type { User } from "@shared/types/User";
import { supabase } from "@/utils/supabase";

export async function updateUser(user: { username: string }): Promise<User> {
    const { data, error } = await supabase.functions.invoke<{
        message: string;
        data: User;
    }>(
        "user-update",
        {
            method: "PATCH",
            body: user,
        },
    );
    if (error) {
        throw error;
    }
    if (!data) {
        throw new Error("No data returned");
    }
    return data.data;
}
