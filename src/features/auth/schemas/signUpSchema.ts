import { z } from 'zod';
import {
    nameSchema,
    emailSchema,
    passwordSchema,
} from './commonSchemas.ts';

export const SignUpSchema = z
    .object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z
            .string()
            .min(1, 'Password confirmation required'),
        jobTitle: z.string().trim().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type SignUpData = z.infer<typeof SignUpSchema>;
