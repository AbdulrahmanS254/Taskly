import { getCookie } from './cookies';

const API_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaG9tb2t1am9vZGR2b3NycHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTgxNzcsImV4cCI6MjA5OTE3NDE3N30.3OXdhRdh5nMyni05dhfQiVJvU1WXeLKLVAEiUq5X8z4';

interface RequestOptions {
    baseUrl?: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    useUserToken?: boolean;
    customToken?: string;
    defaultErrorMessage?: string;
    headers?: Record<string, string>; // to pass custom headers
}

export interface ApiResponse<T> {
    data: T;
    headers: Headers;
}

export async function apiRequest<T>({
    baseUrl = 'https://dehomokujooddvosrpzj.supabase.co',
    endpoint,
    method = 'POST',
    body,
    useUserToken = false,
    customToken,
    defaultErrorMessage = 'Request failed. Please try again.',
    headers = {},
}: RequestOptions): Promise<T> {
    const responseWithHeaders = await apiRequestWithHeaders<T>({
        baseUrl,
        endpoint,
        method,
        body,
        useUserToken,
        customToken,
        defaultErrorMessage,
        headers,
    });

    return responseWithHeaders.data;
}

export async function apiRequestWithHeaders<T>({
    baseUrl = 'https://dehomokujooddvosrpzj.supabase.co',
    endpoint,
    method = 'POST',
    body,
    useUserToken = false,
    customToken,
    defaultErrorMessage = 'Request failed. Please try again.',
    headers = {},
}: RequestOptions): Promise<ApiResponse<T>> {
    let authToken = API_ANON_KEY;

    if (customToken) {
        authToken = customToken;
    } else if (useUserToken) {
        const userToken = getCookie('token');
        if (!userToken) throw new Error('No active token found');
        authToken = userToken;
    }

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            Authorization: `Bearer ${authToken}`,
            ...headers, // 👈 دمج الـ Custom Headers مع الـ Default Headers
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let response: Response;

    try {
        response = await fetch(`${baseUrl}${endpoint}`, config);
    } catch {
        throw new Error(defaultErrorMessage);
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error_description ||
                errorData.message ||
                defaultErrorMessage
        );
    }

    if (response.status === 204) {
        return { data: {} as T, headers: response.headers };
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
        return { data: {} as T, headers: response.headers };
    }

    return {
        data: JSON.parse(text) as T,
        headers: response.headers,
    };
}
