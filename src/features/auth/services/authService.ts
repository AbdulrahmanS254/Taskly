import type { SignUpData } from '../schemas/signUpSchema';
import type { LoginData } from '../schemas/loginSchema';

const API_BASE_URL =
    'https://dehomokujooddvosrpzj.supabase.co/auth/v1';
const API_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaG9tb2t1am9vZGR2b3NycHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTgxNzcsImV4cCI6MjA5OTE3NDE3N30.3OXdhRdh5nMyni05dhfQiVJvU1WXeLKLVAEiUq5X8z4';

export interface CurrentUser {
    user_metadata?: {
        name?: string;
        job_title?: string;
    };
}

// Wrapper Function for api requests
interface RequestOptions {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    useUserToken?: boolean;
    defaultErrorMessage: string;
}

// Response in login & signup
export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    user?: {
        id: string;
        email: string;
    };
}

async function apiRequest<T>({
    endpoint,
    method = 'POST',
    body,
    useUserToken = false,
    defaultErrorMessage = 'Request failed. Please try again.',
}: RequestOptions): Promise<T> {
    let authToken = API_ANON_KEY; // Why?

    // checking if there is a token
    if (useUserToken) {
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

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
    );

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

// Actual requests
export const signUpUser = async (formData: SignUpData) => {
    return apiRequest<AuthResponse>({
        endpoint: '/signup',
        body: {
            email: formData.email,
            password: formData.password,
            data: {
                name: formData.name,
                job_title: formData.jobTitle || '',
            },
        },
        defaultErrorMessage: 'Registration failed. Please try again.',
    });
};

export const loginUser = async ( formData: LoginData ) => {
    return apiRequest<AuthResponse>({
        endpoint: '/token?grant_type=password',
        body: {
            email: formData.email,
            password: formData.password,
        },
        defaultErrorMessage: 'Invalid email or password.'
    })
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
    return apiRequest<CurrentUser>({
        endpoint: '/user',
        method: 'GET',
        useUserToken: true, // هنا بنقوله استخدم التوكن المجهزة في الـ Storage
        defaultErrorMessage: 'Failed to fetch user data.',
    });
};

export const logoutUser = async (): Promise<void> => {
    return apiRequest<void>({
        endpoint: '/logout',
        method: 'POST',
        useUserToken: true,
        defaultErrorMessage: 'Logout failed, please try again.',
    });
};