import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password cannot be empty'),
    rememberMe: z.boolean().optional(),
});

export type LoginData = z.infer<typeof LoginSchema>;