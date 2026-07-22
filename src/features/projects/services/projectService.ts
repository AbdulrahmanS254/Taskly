import { apiRequest } from '../../../utils/apiClient';
import type { AddProjectData } from '../../auth/schemas/commonSchemas';

const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

export const createProject = async (
    data: AddProjectData
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
        defaultErrorMessage: 'Failde to create project.',
    });
};
