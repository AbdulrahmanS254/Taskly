import { apiRequest } from '../../../utils/apiClient';
import { type CreateEpicFormData } from '../schemas/epicSchema';
const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

export const createEpic = async (
    data: CreateEpicFormData
): Promise<void> => {
    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: '/epics',
        method: 'POST',
        body: {
            title: data.title,
            description: data.description,
            assignee_id:
                data.assignee_id && data.assignee_id.trim() !== ''
                    ? data.assignee_id
                    : null,
            project_id: data.project_id,
            deadline: data.deadline?.trim() ? data.deadline : null,
        },
        useUserToken: true,
        defaultErrorMessage:
            'Could not connect to the server. Please check your connection and try again.',
    });
};
