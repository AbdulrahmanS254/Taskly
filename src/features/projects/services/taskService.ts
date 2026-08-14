import { apiRequest } from '../../../utils/apiClient';
import { type CreateTaskFormData } from '../schemas/taskSchema';
import { type EpicUser } from './epicService';

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

/* ======= TASKS BY STATUS (BOARD VIEW) ======= */
export interface TaskEpicRef {
    id: string;
    epic_id: string;
    title: string;
}

export interface Task {
    id: string;
    task_id: string; // human readable identifier, e.g. "TASK-125"
    project_id: string;
    title: string;
    description: string | null;
    status: string;
    assignee: EpicUser | null;
    epic: TaskEpicRef | null;
    created_by: EpicUser;
    created_at: string;
    due_date: string | null;
}

export const getTasksByStatus = async (
    projectId: string,
    status: string
): Promise<Task[]> => {
    return apiRequest<Task[]>({
        baseUrl: projectsURL,
        endpoint: `/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage:
            'Failed to load tasks. Please try again.',
    });
};
