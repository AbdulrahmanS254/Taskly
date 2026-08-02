import { apiRequest } from '../../../utils/apiClient';
import { type AddEpicData } from '../schemas/epicSchema';
const projectsURL = 'https://dehomokujooddvosrpzj.supabase.co/rest/v1';


export const createEpic = async (
    data: AddEpicData
): Promise<void> => {
    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: '/epics',
        method: 'POST',
        body: {
            name: data.name,
            description: data.description,
            assignee_id: data.assignee_id,
            project_id: data.project_id,
            deadline: data.deadline,
        },
        useUserToken: true,
        defaultErrorMessage:
            'Could not connect to the server. Please check your connection and try again.',
    });
};