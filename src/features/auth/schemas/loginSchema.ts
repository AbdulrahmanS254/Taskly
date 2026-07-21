import { z } from 'zod';
import { emailSchema } from './commonSchemas.ts';

export const LoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password cannot be empty'),
    rememberMe: z.boolean().optional(),
});

export type LoginData = z.infer<typeof LoginSchema>;
