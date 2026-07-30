import { apiRequest } from '../../../utils/apiClient';

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
    avatar_url?: string | null;
}

export const getProjectMembers = async (
    projectId: string
): Promise<ProjectMember[]> => {
    return apiRequest<ProjectMember[]>({
        endpoint: `/rest/v1/get_project_members?project_id=eq.${projectId}`,
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage:
            'Failed to load project members. Please try again.',
    });
};
