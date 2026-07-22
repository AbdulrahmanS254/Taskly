const API_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaG9tb2t1am9vZGR2b3NycHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTgxNzcsImV4cCI6MjA5OTE3NDE3N30.3OXdhRdh5nMyni05dhfQiVJvU1WXeLKLVAEiUq5X8z4';

interface RequestOptions {
    baseUrl?: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    useUserToken?: boolean;
    customToken?: string;
    defaultErrorMessage?: string;
}

export async function apiRequest<T>({
    baseUrl = 'https://dehomokujooddvosrpzj.supabase.co',
    endpoint,
    method = 'POST',
    body,
    useUserToken = false,
    customToken,
    defaultErrorMessage = 'Request failed. Please try again.',
}: RequestOptions): Promise<T> {
    let authToken = API_ANON_KEY;

    if (customToken) {
        authToken = customToken;
    } else if (useUserToken) {
        const userToken =
            localStorage.getItem('token') ||
            sessionStorage.getItem('token');
        if (!userToken) throw new Error('No active token found');
        authToken = userToken;
    }

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            Authorization: `Bearer ${authToken}`,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error_description ||
                errorData.message ||
                defaultErrorMessage
        );
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}