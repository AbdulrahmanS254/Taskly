import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router';

import {
    resetPasswordSchema,
    type ResetPasswordData,
} from '../schemas/resetPasswordSchema';
import { updatePassword } from '../services/authService';
import {
    IconAlert,
    IconCheck,
    IconEye,
    IconEyeOff,
    IconLogo,
    IconSuccess,
} from '../../../components/ui/icons';

const fieldLabel =
    'text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#434654]';
const fieldInput =
    'h-12 w-full rounded-sm border bg-surface-low px-[17px] text-base text-slate-900 placeholder:text-slate-muted transition focus:outline-none focus:border-primary';

export default function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState<string | null>(
        null
    );
    const [isLinkValid, setIsLinkValid] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(
        null
    );
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const password = watch('password') ?? '';
    const requirements = [
        {
            label: '8-64 characters',
            met: password.length >= 8 && password.length <= 64,
        },
        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One digit', met: /\d/.test(password) },
        {
            label: 'Special character',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    useEffect(() => {
        const hashParams = new URLSearchParams(
            location.hash.replace('#', '')
        );
        const token = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (token && type === 'recovery') {
            setAccessToken(token);
            setIsLinkValid(true);
        } else {
            setIsLinkValid(false);
        }
    }, [location]);

    const onSubmit = async (data: ResetPasswordData) => {
        if (!accessToken) return;
        setServerError(null);

        try {
            await updatePassword(data.password, accessToken);
            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: unknown) {
            setServerError(
                error instanceof Error && error.message
                    ? error.message
                    : 'Failed to update password. Please try again.'
            );
        }
    };

    return (
        <div className="relative min-h-screen bg-[#f0f1f5] overflow-hidden">
            {/* Decorative background accents */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -left-12 top-64 size-64 rounded-xl border border-primary/5" />
                <div className="absolute -right-32 bottom-56 size-96 rotate-12 rounded border border-primary/5" />
            </div>

            {/* Header */}
            <header className="relative flex h-20 items-center px-6 md:px-10">
                <div className="flex items-center gap-2">
                    <div className="size-[18px] text-primary">
                        <IconLogo className="w-full h-full" />
                    </div>
                    <span className="text-xl font-bold tracking-[-0.5px] text-slate-900">
                        TASKLY
                    </span>
                </div>
            </header>

            {/* Main */}
            <main className="relative flex justify-center px-4 pb-16 pt-4 md:pt-8">
                <div className="relative w-full max-w-[512px]">
                    {/* Tonal layering behind the card */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-1 bottom-1 rounded-lg bg-surface-low"
                    />

                    <div className="relative rounded-lg border border-slate-300/30 bg-white p-6 shadow-[0px_24px_48px_-12px_rgba(4,27,60,0.06)] md:p-12">
                        {!isLinkValid ? (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <div className="flex size-16 items-center justify-center rounded-xl bg-[#ffdad6]">
                                    <IconAlert className="size-8 text-error" />
                                </div>
                                <h1 className="text-2xl font-semibold leading-[30px] tracking-[-0.6px] text-slate-900">
                                    Invalid or expired link
                                </h1>
                                <p className="max-w-sm text-sm leading-5 text-[#434654]">
                                    This password reset link is no
                                    longer valid. Request a new one to
                                    continue.
                                </p>
                                <Link
                                    to="/forgot-password"
                                    className="mt-2 flex h-12 w-full items-center justify-center rounded-sm bg-linear-to-b from-primary to-primary-container text-base font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition hover:opacity-95"
                                >
                                    Request a new link
                                </Link>
                            </div>
                        ) : isSuccess ? (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <div className="flex size-16 items-center justify-center rounded-xl bg-success/20">
                                    <IconSuccess className="size-8 text-[#005235]" />
                                </div>
                                <h1 className="text-2xl font-semibold leading-[30px] tracking-[-0.6px] text-slate-900">
                                    Password updated
                                </h1>
                                <p className="max-w-sm text-sm leading-5 text-[#434654]">
                                    Your password has been updated
                                    successfully. You can now log in
                                    with your new password.
                                </p>
                                <p className="text-xs font-medium text-slate-muted">
                                    Redirecting to login...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-semibold leading-[30px] tracking-[-0.6px] text-slate-900">
                                        Create a New Password
                                    </h1>
                                    <p className="text-sm leading-5 text-[#434654]">
                                        Create a new, strong password
                                        to secure your workstation
                                        access.
                                    </p>
                                </div>

                                {serverError && (
                                    <div className="mt-6 flex items-start gap-2 rounded-lg border border-error/20 bg-error/10 p-3">
                                        <IconAlert className="mt-0.5 size-4 shrink-0 text-error" />
                                        <p className="text-sm font-medium text-error">
                                            {serverError}
                                        </p>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    noValidate
                                    className="mt-6 flex flex-col gap-6"
                                >
                                    {/* New password */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="password"
                                            className={fieldLabel}
                                        >
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                {...register(
                                                    'password'
                                                )}
                                                className={`${fieldInput} pr-12 ${
                                                    errors.password
                                                        ? 'border-error'
                                                        : 'border-slate-300/30'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) =>
                                                            !prev
                                                    )
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? 'Hide password'
                                                        : 'Show password'
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted cursor-pointer"
                                            >
                                                {showPassword ? (
                                                    <IconEyeOff />
                                                ) : (
                                                    <IconEye />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs font-medium text-error">
                                                {
                                                    errors.password
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm password */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="confirmPassword"
                                            className={fieldLabel}
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            {...register(
                                                'confirmPassword'
                                            )}
                                            className={`${fieldInput} ${
                                                errors.confirmPassword
                                                    ? 'border-error'
                                                    : 'border-slate-300/30'
                                            }`}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-xs font-medium text-error">
                                                {
                                                    errors
                                                        .confirmPassword
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Security requirements */}
                                    <div className="flex flex-col gap-4 rounded border border-slate-300/10 bg-surface-low/50 p-5">
                                        <div className="border-b border-slate-300/20 pb-2.5">
                                            <p className={fieldLabel}>
                                                Security Requirements
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {requirements.map(
                                                (requirement) => (
                                                    <div
                                                        key={
                                                            requirement.label
                                                        }
                                                        className={`flex h-[19.5px] items-center gap-2 ${
                                                            requirement.met
                                                                ? ''
                                                                : 'opacity-50'
                                                        }`}
                                                    >
                                                        <IconCheck
                                                            className="size-[15px] shrink-0"
                                                            active={
                                                                requirement.met
                                                            }
                                                        />
                                                        <span className="text-[13px] leading-[19.5px] text-slate-900">
                                                            {
                                                                requirement.label
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex h-14 w-full items-center justify-center rounded-sm bg-linear-to-b from-primary to-primary-container text-base font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                    >
                                        {isSubmitting
                                            ? 'Updating Password...'
                                            : 'Update Password'}
                                    </button>

                                    <div className="flex justify-center">
                                        <Link
                                            to="/login"
                                            className="text-[13px] font-medium leading-[19.5px] text-primary hover:underline"
                                        >
                                            Back to sign in
                                        </Link>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
