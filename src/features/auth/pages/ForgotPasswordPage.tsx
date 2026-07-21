import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import {
    forgotPasswordSchema,
    type ForgotPasswordData,
} from '../schemas/forgotPasswordSchema';
import { recoverPassword } from '../services/authService';

const COOLDOWN_TIME = 300;
const MAX_TRIALS = 3;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [trialsCount, setTrialsCount] = useState(0);
    const [timer, setTimer] = useState(0);
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
    });

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const sendRecoveryEmail = async (email: string) => {
        setServerError(null);
        try {
            await recoverPassword(email);
            setIsSubmitted(true);
            setTrialsCount((prev) => prev + 1);
            setTimer(COOLDOWN_TIME);
        } catch (error: any) {
            setServerError(
                error.message ||
                    'Something went wrong. Please try again.'
            );
        }
    };

    const onSubmit = async (data: ForgotPasswordData) => {
        if (trialsCount >= MAX_TRIALS) return;
        await sendRecoveryEmail(data.email);
    };

    const handleResend = async () => {
        if (timer > 0 || trialsCount >= MAX_TRIALS || isSubmitting)
            return;
        const email = getValues('email');
        if (!email) return;
        await sendRecoveryEmail(email);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white border border-slate-300/30 rounded-lg shadow-[0px_24px_48px_-12px_rgba(4,27,60,0.06)]">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 mb-8">
                <div className="sm:hidden bg-surface-highest flex items-center justify-center rounded-xl size-12 mb-3">
                    <svg
                        className="size-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <rect
                            x="4"
                            y="9"
                            width="12"
                            height="8"
                            rx="1.5"
                        />
                        <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                    Reset Password
                </h2>
                <p className="text-sm text-slate-500">
                    Enter your email address and we will send you a
                    link to reset your password.
                </p>
            </div>

            {serverError && (
                <div className="p-3 mb-4 bg-error/10 border border-error/20 text-error text-sm rounded-md font-medium">
                    {serverError}
                </div>
            )}

            {isSubmitted && (
                <div className="p-4 mb-6 bg-success/15 rounded-lg flex gap-3 items-start">
                    <svg
                        className="size-5 text-[#005235] shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <circle cx="10" cy="10" r="7.5" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 10l2 2 4-4.5"
                        />
                    </svg>
                    <p className="text-[#005235] text-sm">
                        If an account exists with this email, we’ve
                        sent a password reset link.
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
            >
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        disabled={isSubmitted}
                        className="w-full bg-surface-highest border border-slate-300/30 px-4 py-3 rounded text-slate-900 placeholder:text-slate-muted focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-60"
                        placeholder="name@example.com"
                    />
                    {errors.email && (
                        <p className="text-error text-xs mt-1.5 font-medium">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-br from-primary to-primary-container text-white py-3 rounded font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting
                            ? 'Sending Link...'
                            : 'Send Reset Link'}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={
                                timer > 0 ||
                                trialsCount >= MAX_TRIALS ||
                                isSubmitting
                            }
                            className="w-full bg-surface-low text-slate-muted py-3 rounded font-semibold flex items-center justify-center gap-2 hover:bg-surface-highest transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <svg
                                className="size-4.5 shrink-0"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <rect
                                    x="2.5"
                                    y="4.5"
                                    width="15"
                                    height="11"
                                    rx="1.5"
                                />
                                <path d="M2.5 5.5l7.5 6 7.5-6" />
                            </svg>
                            {isSubmitting
                                ? 'Sending...'
                                : timer > 0
                                  ? `Resend Email in (${formatTime(timer)})`
                                  : trialsCount >= MAX_TRIALS
                                    ? 'Maximum trials reached'
                                    : 'Resend Email'}
                        </button>
                        <p className="text-xs text-center text-slate-500">
                            Trials left: {MAX_TRIALS - trialsCount} of{' '}
                            {MAX_TRIALS}
                        </p>
                    </div>
                )}

                <div className="text-center pt-2">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                    >
                        <svg
                            className="size-3"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15l-5-5 5-5"
                            />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
