import { apiRequest } from '../../../utils/apiClient';
import { type CreateEpicFormData } from '../schemas/epicSchema';
const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

// Creating Epics
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

/* ======= EPICS LISTING ======= */
export interface EpicUser {
    id: string;
    name: string;
    avatar_url?: string | null;
}

export interface Epic {
    id: string;
    epic_id: string; // human readable identifier, e.g. "EPIC-12"
    project_id: string;
    title: string;
    description: string | null;
    assignee: EpicUser | null;
    created_by: EpicUser;
    created_at: string;
    deadline: string | null;
}

export const getProjectEpics = async (
    projectId: string
): Promise<Epic[]> => {
    return apiRequest<Epic[]>({
        baseUrl: projectsURL,
        endpoint: `/project_epics?project_id=eq.${projectId}`,
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage:
            'Failed to load project epics. Please try again.',
    });
};
