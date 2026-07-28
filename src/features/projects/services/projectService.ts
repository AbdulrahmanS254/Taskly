import { apiRequest, apiRequestWithHeaders } from '../../../utils/apiClient';
import type { AddProjectData } from '../../auth/schemas/commonSchemas';

const projectsURL = 'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export interface PaginatedProjectsResponse {
    data: Project[];
    totalCount: number;
}

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
        defaultErrorMessage:
            'Could not connect to the server. Please check your connection and try again.',
    });
};

export async function getProjects(
    page: number = 1,
    limit: number = 9
): Promise<PaginatedProjectsResponse> {
    const offset = (page - 1) * limit;

    const { data, headers } = await apiRequestWithHeaders<Project[]>({
        endpoint: `/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
        method: 'GET',
        useUserToken: true,
        headers: {
            Prefer: 'count=exact',
        },
    });

    const contentRange =
        headers.get('Content-Range') || headers.get('content-range');
    let totalCount = 0;

    if (contentRange) {
        const parts = contentRange.split('/');
        if (parts.length > 1) {
            totalCount = parseInt(parts[1], 10) || 0;
        }
    } else {
        totalCount = Array.isArray(data) ? data.length : 0;
    }

    return {
        data: Array.isArray(data) ? data : [],
        totalCount,
    };
}

export async function getProjectById(
    projectId: string
): Promise<Project> {
    const projects = await apiRequest<Project[]>({
        endpoint: `/rest/v1/projects?id=eq.${projectId}&select=*`,
        method: 'GET',
        useUserToken: true,
    });

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        throw new Error('Project not found');
    }

    return projects[0];
}

export async function updateProject(
    projectId: string,
    data: { name: string; description?: string | undefined }
): Promise<void> {
    await apiRequest<void>({
        endpoint: `/rest/v1/projects?id=eq.${projectId}`,
        method: 'PATCH',
        body: data,
        useUserToken: true,
    });
}