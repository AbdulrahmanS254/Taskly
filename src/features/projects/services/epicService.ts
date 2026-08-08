import { apiRequest, apiRequestWithHeaders } from '../../../utils/apiClient';
import { type CreateEpicFormData } from '../schemas/epicSchema';
const projectsURL =
    'https://dehomokujooddvosrpzj.supabase.co/rest/v1';

// Creating Epics
export const createEpic = async (
    data: CreateEpicFormData
): Promise<void> => {
    // Forcefully sanitize the payload here — blank strings from the form
    // must never reach PostgREST as "" for a date column or a uuid FK.
    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: '/epics',
        method: 'POST',
        body: {
            title: data.title,
            description: data.description?.trim()
                ? data.description
                : null,
            assignee_id: data.assignee_id?.trim()
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

export interface PaginatedEpics {
    epics: Epic[];
    totalCount: number;
}

export const getProjectEpics = async (
    projectId: string,
    page: number,
    limit: number
): Promise<PaginatedEpics> => {
    const offset = (page - 1) * limit;

    const { data, headers } = await apiRequestWithHeaders<Epic[]>({
        baseUrl: projectsURL,
        endpoint: `/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
        method: 'GET',
        useUserToken: true,
        headers: {
            Prefer: 'count=exact',
        },
        defaultErrorMessage:
            'Failed to load project epics. Please try again.',
    });

    const contentRange = headers.get('content-range');
    const parsedTotal = contentRange
        ? Number(contentRange.split('/')[1])
        : NaN;
    const totalCount = Number.isFinite(parsedTotal) ? parsedTotal : 0;

    return { epics: data, totalCount };
};

/* ======= EPIC UPDATE ======= */
// Fields the inline editor is allowed to PATCH.
export interface EpicUpdate {
    title?: string;
    description?: string | null;
    assignee_id?: string | null;
    deadline?: string | null;
}

// Blank strings must go to PostgREST as null, otherwise "" breaks the uuid FK
// (assignee_id) and the date column (deadline).
export const updateEpic = async (
    epicId: string,
    updates: EpicUpdate
): Promise<void> => {
    const body: EpicUpdate = {};

    if (updates.title !== undefined) {
        body.title = updates.title;
    }
    if (updates.description !== undefined) {
        body.description = updates.description?.trim()
            ? updates.description
            : null;
    }
    if (updates.assignee_id !== undefined) {
        body.assignee_id = updates.assignee_id?.trim()
            ? updates.assignee_id
            : null;
    }
    if (updates.deadline !== undefined) {
        body.deadline = updates.deadline?.trim()
            ? updates.deadline
            : null;
    }

    return apiRequest<void>({
        baseUrl: projectsURL,
        endpoint: `/epics?id=eq.${epicId}`,
        method: 'PATCH',
        body,
        useUserToken: true,
        defaultErrorMessage:
            'Failed to update epic. Please try again.',
    });
};

/* ======= EPIC DETAILS ======= */
// PostgREST returns an array even for a single-row filter, so unwrap it here.
export const getEpicDetails = async (
    projectId: string,
    epicId: string
): Promise<Epic | null> => {
    const data = await apiRequest<Epic[]>({
        baseUrl: projectsURL,
        endpoint: `/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage:
            'Failed to load epic details. Please try again.',
    });

    return data.length > 0 ? data[0] : null;
};
