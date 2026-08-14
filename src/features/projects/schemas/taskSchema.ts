import z from 'zod';
import {
    projectNameSchema,
    optionalIdSchema,
    projectDescriptionSchema,
    dueDateSchema,
} from '../../auth/schemas/commonSchemas';

export const STATUS_VALUES = [
    'TO_DO',
    'IN_PROGRESS',
    'BLOCKED',
    'IN_REVIEW',
    'READY_FOR_QA',
    'REOPENED',
    'READY_FOR_PRODUCTION',
    'DONE',
] as const;

const statusSchema = z.enum(STATUS_VALUES);

export const addTaskSchema = z.object({
    epic_id: optionalIdSchema,
    title: projectNameSchema,
    description: projectDescriptionSchema,
    assignee_id: optionalIdSchema,
    due_date: dueDateSchema,
    status: statusSchema.default('TO_DO'),
});

export type CreateTaskFormData = z.infer<typeof addTaskSchema>;
