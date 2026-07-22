import { z } from 'zod';

const nameRegex =
    /^[a-zA-Z\u0600-\u06FF\u00C0-\u017F]+(?: [a-zA-Z\u0600-\u06FF\u00C0-\u017F]+)*$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-\[\]\\\/`~#;=]).+$/;

export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address');

export const passwordSchema = z
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
    });

export const nameSchema = z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters.')
    .regex(
        nameRegex,
        'Name must contain letters and single spaces only'
    );

/* ======= PROJECT & EPICS SCHEMAS ======= */
// NAME
export const projectNameSchema = z
    .string()
    .trim()
    .min(1, 'Project title is required')
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title must be at most 100 characters');
// DISC
export const projectDescriptionSchema = z
    .string()
    .trim()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal(''));

export const addProjectSchema = z.object({
    name: projectNameSchema,
    description: projectDescriptionSchema,
});

export type AddProjectData = z.infer<typeof addProjectSchema>;
