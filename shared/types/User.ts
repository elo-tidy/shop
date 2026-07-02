import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    role: z.string(),
    created_at: z.string(),
    updated_at: z.string().nullable().optional(),
    active: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;
