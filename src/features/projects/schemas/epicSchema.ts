import z from "zod";
import { projectNameSchema, projectDescriptionSchema, optionalStringSchema,optionalIdSchema, dateSchema } from "../../auth/schemas/commonSchemas";


export const addEpicSchema = z.object({
    name: projectNameSchema,
    description: projectDescriptionSchema,
    assignee_id: optionalStringSchema,
    project_id: optionalIdSchema,
    deadline: dateSchema,
});


export type AddEpicData = z.infer<typeof addEpicSchema>;