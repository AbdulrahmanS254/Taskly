import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink, useNavigate } from 'react-router';

import { SignUpSchema } from '../schemas/signUpSchema';
import type { SignUpData } from '../schemas/signUpSchema';
import { Input } from '../../../components/ui/Input';
import { signUpUser } from '../services/authService';

export default function SignUpForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
        mode: 'onTouched',
    });

    const password = watch('password') ?? '';
    const hasMinLength = password.length >= 8;
    const hasUpperLowerDigit = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    const onSubmit = async (data: SignUpData) => {
        setServerError(null);
        try {
            const result = await signUpUser(data);
            if (result.access_token) {
                localStorage.setItem('token', result.access_token);
            }
            navigate('/project');
        } catch (error: any) {
            setServerError(error.message || 'Something went wrong.');
        }
    };

    return (
        <div className="w-full sm:max-w-xl px-4 py-10 sm:p-12 sm:bg-white sm:rounded-lg sm:shadow-[0px_24px_48px_0px_rgba(4,27,60,0.06)]">
            <div className="text-left sm:text-center mb-8 sm:mb-10">
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                    Create your workspace
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Join the editorial approach to task management.
                </p>
            </div>

            {serverError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg font-medium">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    helperText="3-50 characters, letters only."
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="yourname@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Job Title (Optional)"
                    placeholder="e.g. Project Manager"
                    error={errors.jobTitle?.message}
                    {...register('jobTitle')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Password"
                        isPassword
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Repeat your password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                <div className="bg-surface-low content-stretch flex flex-col gap-2 items-start p-4 rounded-lg w-full">
                    <div className="flex gap-2 items-center w-full">
                        <CheckDot active={hasMinLength} />
                        <span className="text-slate-900 text-xs">At least 8 characters</span>
                    </div>
                    <div className="flex gap-2 items-center w-full">
                        <CheckDot active={hasUpperLowerDigit} />
                        <span className="text-slate-900 text-xs">One uppercase, lowercase, and digit</span>
                    </div>
                    <div className="flex gap-2 items-center w-full">
                        <CheckDot active={hasSpecialChar} />
                        <span className="text-slate-900 text-xs">One special character</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-linear-to-br from-primary to-primary-container text-white font-semibold rounded shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="flex justify-center gap-1 pt-8 text-sm">
                <span className="text-slate-500">Already have an account?</span>
                <NavLink to={"/login"} className="text-primary font-semibold cursor-pointer">Log in</NavLink>
            </div>
        </div>
    );
}

function CheckDot({ active }: { active: boolean }) {
    return (
        <svg
            className={`size-3 shrink-0 ${active ? 'text-success' : 'text-slate-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            {active ? (
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            ) : (
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            )}
        </svg>
    );
}