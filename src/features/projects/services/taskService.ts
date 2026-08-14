import { apiRequest } from '../../../utils/apiClient';
import { type CreateTaskFormData } from '../schemas/taskSchema';

const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

// Creating Tasks
export const createTask = async (
    projectId: string,
    data: CreateTaskFormData
): Promise<void> => {
    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: '/tasks',
        method: 'POST',
        body: {
            title: data.title,
            description: data.description?.trim()
                ? data.description
                : null,
            status: data.status,
            assignee_id: data.assignee_id?.trim()
                ? data.assignee_id
                : null,
            epic_id: data.epic_id?.trim() ? data.epic_id : null,
            due_date: data.due_date?.trim() ? data.due_date : null,
            project_id: projectId,
        },
        useUserToken: true,
        defaultErrorMessage:
            'Could not connect to the server. Please check your connection and try again.',
    });
};
