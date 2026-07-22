import { apiRequest } from '../../../utils/apiClient';
import type { SignUpData } from '../schemas/signUpSchema';
import type { LoginData } from '../schemas/loginSchema';

export interface CurrentUser {
    user_metadata?: {
        name?: string;
        job_title?: string;
    };
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    user?: {
        id: string;
        email: string;
    };
}

const authURL = 'https://dehomokujooddvosrpzj.supabase.co/auth/v1';

export const signUpUser = async (formData: SignUpData) => {
    return apiRequest<AuthResponse>({
        baseUrl: authURL,
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

export const loginUser = async (formData: LoginData) => {
    return apiRequest<AuthResponse>({
        baseUrl: authURL,
        endpoint: '/token?grant_type=password',
        body: {
            email: formData.email,
            password: formData.password,
        },
        defaultErrorMessage: 'Invalid email or password.',
    });
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
    return apiRequest<CurrentUser>({
        baseUrl: authURL,
        endpoint: '/user',
        method: 'GET',
        useUserToken: true,
        defaultErrorMessage: 'Failed to fetch user data.',
    });
};

export const logoutUser = async (): Promise<void> => {
    return apiRequest<void>({
        baseUrl: authURL,
        endpoint: '/logout',
        method: 'POST',
        useUserToken: true,
        defaultErrorMessage: 'Logout failed, please try again.',
    });
};

export const recoverPassword = async (email: string): Promise<void> => {
    return apiRequest<void>({
        baseUrl: authURL,
        endpoint: '/recover',
        method: 'POST',
        body: { email },
        defaultErrorMessage: 'Failed to send password reset link.',
    });
};

export const updatePassword = async (
    newPassword: string,
    accessToken: string
): Promise<void> => {
    return apiRequest<void>({
        baseUrl: authURL,
        endpoint: '/user',
        method: 'PUT',
        body: { password: newPassword },
        customToken: accessToken,
        defaultErrorMessage: 'Failed to update password.',
    });
};