import { z } from "zod";

export const signinSchema = z.object({
    email: z.string().min(5).max(40).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string().min(7).max(20)
})

export type signinType = z.infer<typeof signinSchema>;