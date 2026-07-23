import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink, useNavigate } from 'react-router';

import { LoginSchema } from '../schemas/loginSchema';
import type { LoginData } from '../schemas/loginSchema';
import { Input } from '../../../components/ui/Input';
import { loginUser } from '../services/authService';

export default function LoginForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(LoginSchema),
        mode: 'onTouched',
    });

    const onSubmit = async (data: LoginData) => {
        setServerError(null);
        try {
            const result = await loginUser(data);
            
            if (result.access_token) {
                localStorage.setItem('token', result.access_token);
            }
            
            navigate('/project');
        } catch (error: any) {
            const isNetworkError =
                error?.message?.includes('Failed to fetch');
            // making sure it's not a network error
            setServerError(
                isNetworkError
                    ? 'Unable to connect. Please try again later.'
                    : error?.message || 'Invalid email or password.')
        }
    };

    return (
        <div className="w-full sm:max-w-xl px-4 py-10 sm:p-12 sm:bg-white sm:rounded-lg sm:shadow-[0px_24px_48px_0px_rgba(4,27,60,0.06)]">
            <div className="text-left sm:text-center mb-8 sm:mb-10">
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                    Log in to your workspace
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Enter your details to continue.
                </p>
            </div>

            {serverError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg font-medium">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                    label="Email"
                    type="email"
                    placeholder="yourname@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Password"
                        isPassword
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <div className="flex justify-end mt-2">
                        <NavLink to={'/forgot-password'} className="text-xs text-primary font-semibold cursor-pointer hover:underline">
                            Forgot password?
                        </NavLink>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        {...register('rememberMe')}
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-900 cursor-pointer select-none">
                        Remember Me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-linear-to-br from-primary to-primary-container text-white font-semibold rounded shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div className="flex justify-center gap-1 pt-8 text-sm">
                <span className="text-slate-500">Don’t have an account?</span>
                <NavLink to={"/sign-up"} className="text-primary font-semibold cursor-pointer hover:underline">
                    Sign up
                </NavLink>
            </div>
        </div>
    );
}