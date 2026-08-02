import { apiRequest } from '../../../utils/apiClient';
import type { AddEpicData } from '../../auth/schemas/commonSchemas';

const projectsURL = 'https://dehomokujooddvosrpzj.supabase.co/rest/v1';


export const createProject = async (
    data: AddEpicData
): Promise<void> => {
    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: '/projects',
        method: 'POST',
        body: {
            name: data.name,
            description: data.description,
        },
        useUserToken: true,
        defaultErrorMessage:
            'Could not connect to the server. Please check your connection and try again.',
    });
};