import { apiRequest } from '../../../utils/apiClient';

// interface for the metadata --> cleaner structure
export interface ProjectMemberMetadata {
    sub?: string;
    name: string;
    email: string;
    job_title?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    avatar_url?: string | null;
}

// The main member interface matching the Supabase response
export interface ProjectMember {
    member_id: string;
    project_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    email: string;
    metadata: ProjectMemberMetadata;
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
