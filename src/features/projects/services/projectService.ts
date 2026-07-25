import { apiRequest } from '../../../utils/apiClient';
import type { AddProjectData } from '../../auth/schemas/commonSchemas';

const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
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
        defaultErrorMessage: 'Could not connect to the server. Please check your connection and try again.',
    });
};

export const getProjects = async (): Promise<Project[]> => {
    return apiRequest<Project[]>({
        baseUrl: projectsURL,
        endpoint: '/projects',
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage: 'Failed to fetch projects. Please try again.',
    });
};


// Update Project
export async function getProjectById(projectId: string): Promise<Project> {
    const projects = await apiRequest<Project[]>({
        endpoint: `/rest/v1/projects?id=eq.${projectId}&select=*`,
        method: 'GET',
        useUserToken: true,
    });
    
    if (!projects || projects.length === 0) {
        throw new Error('Project not found');
    }
    
    return projects[0];
}

export async function updateProject(
    projectId: string, 
    data: { name: string; description?: string | undefined }
): Promise<void> {
    await apiRequest({
        endpoint: `/rest/v1/projects?id=eq.${projectId}`,
        method: 'PATCH',
        body: data,
        useUserToken: true,
    });
}