import { z } from 'zod';

// custom regex for name & password
const nameRegex =
    /^[a-zA-Z\u0600-\u06FF\u00C0-\u017F]+(?: [a-zA-Z\u0600-\u06FF\u00C0-\u017F]+)*$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-\[\]\\\/`~#;=]).+$/;

export const SignUpSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name must be at most 50 characters.')
            .regex(
                nameRegex,
                'Name must contain letters and single spaces only'
            ),
        email: z.email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password required')
            .min(8, 'Password should be at least 8 characters')
            .max(64, 'Password should be at most 64 characters')
            .refine((val) => !/\s/.test(val), {
                message: 'No spaces in password',
            })
            .refine((val) => passwordRegex.test(val), {
                message:
                    'At least 8 characters, one uppercase, lowercase, digit and one special character',
            }),
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
