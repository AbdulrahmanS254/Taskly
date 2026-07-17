import type { SignUpData } from '../schemas/signUpSchema';
import type { LoginData } from '../schemas/loginSchema';

const API_BASE_URL = 'https://dehomokujooddvosrpzj.supabase.co/auth/v1';
const API_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaG9tb2t1am9vZGR2b3NycHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTgxNzcsImV4cCI6MjA5OTE3NDE3N30.3OXdhRdh5nMyni05dhfQiVJvU1WXeLKLVAEiUq5X8z4';

export interface CurrentUser {
    user_metadata?: {
        name?: string;
        job_title?: string;
    };
}

export const signUpUser = async (formData: SignUpData) => {
    const apiBody = {
        email: formData.email,
        password: formData.password,
        data: {
            name: formData.name,
            job_title: formData.jobTitle || '',
        },
    };

    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            Authorization: `Bearer ${API_ANON_KEY}`,
        },
        body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error_description ||
                errorData.message ||
                'Registration failed. Please try again.'
        );
    }

    return response.json();
};

export const loginUser = async (formData: LoginData) => {
    const response = await fetch(`${API_BASE_URL}/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            Authorization: `Bearer ${API_ANON_KEY}`,
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error_description || 
                errorData.message || 
                'Invalid email or password.'
        );
    }

    return response.json();
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) throw new Error('No session found');

    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            apikey: API_ANON_KEY,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user data.');
    }

    return response.json();
};