import { z } from 'zod';
import { passwordSchema } from './commonSchemas';

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z
            .string()
            .min(1, 'Password confirmation required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;