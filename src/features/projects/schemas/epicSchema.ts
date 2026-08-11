import z from "zod";
import { projectNameSchema, projectDescriptionSchema, optionalIdSchema, futureDateSchema } from "../../auth/schemas/commonSchemas";


export const addEpicSchema = z.object({
    title: projectNameSchema,
    description: projectDescriptionSchema,
    assignee_id: optionalIdSchema,
    project_id: optionalIdSchema,
    deadline: futureDateSchema,
});


export type CreateEpicFormData = z.infer<typeof addEpicSchema>;