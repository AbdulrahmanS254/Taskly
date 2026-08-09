import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';

import {
    forgotPasswordSchema,
    type ForgotPasswordData,
} from '../schemas/forgotPasswordSchema';
import { recoverPassword } from '../services/authService';
import {
    IconAlert,
    IconLogo,
    IconSuccess,
} from '../../../components/ui/icons';

/**
 * Volatile, in-memory only. This exists purely to stop accidental double
 * submissions — real rate limiting is enforced by the backend. Refreshing
 * the page intentionally clears it.
 */
const RESEND_COOLDOWN_SECONDS = 60;

function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function IconArrowLeft() {
    return (
        <svg
            className="size-4 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 8H3m0 0l4.5-4.5M3 8l4.5 4.5"
            />
        </svg>
    );
}

function IconTimer() {
    return (
        <svg
            className="size-4.5rink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <circle cx="10" cy="11" r="6.5" />
            <path
                strokeLinecap="round"
                d="M10 8.5V11l1.75 1.75M8 2h4"
            />
        </svg>
    );
}

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [serverError, setServerError] = useState<string | null>(
        null
    );

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    // Ticks the cooldown down once per second, then stops.
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timeout = setTimeout(
            () => setSecondsLeft((prev) => prev - 1),
            1000
        );
        return () => clearTimeout(timeout);
    }, [secondsLeft]);

    const sendResetLink = async (email: string) => {
        setServerError(null);
        try {
            await recoverPassword(email);
            setIsSubmitted(true);
            setSecondsLeft(RESEND_COOLDOWN_SECONDS);
        } catch (error: unknown) {
            setServerError(
                error instanceof Error && error.message
                    ? error.message
                    : 'Something went wrong. Please try again.'
            );
        }
    };

    const onSubmit = async (data: ForgotPasswordData) => {
        await sendResetLink(data.email);
    };

    const handleResend = async () => {
        if (secondsLeft > 0 || isSubmitting) return;
        const email = getValues('email');
        if (!email) return;
        await sendResetLink(email);
    };

    return (
        <div className="relative min-h-screen bg-[#f0f1f5] overflow-hidden">
            {/* Decorative background accents */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -left-12 top-52 size-64 rounded-xl border border-primary/5" />
                <div className="absolute -right-32 bottom-44 size-96 rotate-12 rounded border border-primary/5" />
            </div>

            {/* Header */}
            <header className="relative flex h-20 items-center px-6 md:px-10">
                <div className="flex items-center gap-2">
                    <div className="size-4.5 text-primary">
                        <IconLogo className="w-full h-full" />
                    </div>
                    <span className="text-xl font-bold tracking-[-0.5px] text-slate-900">
                        TASKLY
                    </span>
                </div>
            </header>

            {/* Main */}
            <main className="relative flex justify-center px-4 pb-16 pt-4 md:pt-8">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-8 rounded-lg border border-slate-300/30 bg-white p-6 shadow-[0px_24px_48px_-12px_rgba(4,27,60,0.06)] md:p-10">
                        {/* Form header */}
                        <div className="flex flex-col gap-1.75">
                            <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.8px] text-slate-900">
                                Forgot password?
                            </h1>
                            <p className="text-sm leading-[22.75px] text-[#434654]">
                                No worries, we'll send you reset
                                instructions.
                            </p>
                        </div>

                        {serverError && (
                            <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/10 p-3">
                                <IconAlert className="mt-0.5 size-4 shrink-0 text-error" />
                                <p className="text-sm font-medium text-error">
                                    {serverError}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="email"
                                    className="text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#434654]"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`h-12 w-full rounded border bg-surface-highest px-4.25 text-base text-slate-900 placeholder:text-slate-muted transition focus:outline-none focus:border-primary ${
                                        errors.email
                                            ? 'border-error'
                                            : 'border-slate-300/30'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-xs font-medium text-error">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex h-12 w-full items-center justify-center rounded bg-linear-to-b from-primary to-primary-container text-base font-semibold text-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {isSubmitting
                                    ? 'Sending...'
                                    : 'Send Reset Link'}
                            </button>

                            <div className="flex justify-center">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1 text-sm font-medium leading-5.25 text-primary hover:underline"
                                >
                                    <IconArrowLeft />
                                    Back to log in
                                </Link>
                            </div>
                        </form>

                        {/* Success state */}
                        {isSubmitted && (
                            <div className="flex flex-col gap-6 border-t border-slate-300/15 pt-6 md:pt-10">
                                <div className="flex gap-3 rounded-lg bg-success/20 p-4">
                                    <IconSuccess className="size-5 shrink-0 text-[#005235]" />
                                    <p className="text-sm leading-[17.5px] text-[#005235]">
                                        If an account exists with this
                                        email, we've sent a password
                                        reset link.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    <p className="text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#434654]">
                                        Didn't receive the email?
                                    </p>

                                    {secondsLeft > 0 ? (
                                        <div className="flex h-12 w-full items-center justify-center gap-2 rounded bg-surface-low text-base font-semibold text-slate-muted">
                                            <IconTimer />
                                            Resend in{' '}
                                            {formatTime(secondsLeft)}
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isSubmitting}
                                            className="flex h-12 w-full items-center justify-center gap-2 rounded border border-slate-300/30 bg-surface-low text-base font-semibold text-primary transition hover:bg-surface-highest disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                        >
                                            {isSubmitting
                                                ? 'Sending...'
                                                : 'Resend Email'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
