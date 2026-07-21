import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Input } from '../../../components/ui/Input';
import {
    forgotPasswordSchema,
    type ForgotPasswordData,
} from '../schemas/forgotPasswordSchema';
import { recoverPassword } from '../services/authService';

const COOLDOWN_SECONDS = 300; // 5 Minutes
const MAX_TRIALS = 3;

const STORAGE_KEYS = {
    COOLDOWN_END: 'forgot_password_cooldown_end',
    TRIALS_COUNT: 'forgot_password_trials_count',
    SUBMITTED_EMAIL: 'forgot_password_email',
};

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
        return !!localStorage.getItem(STORAGE_KEYS.SUBMITTED_EMAIL);
    });

    const [trialsCount, setTrialsCount] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.TRIALS_COUNT);
        return saved ? parseInt(saved, 10) : 0;
    });

    const [timer, setTimer] = useState<number>(0);
    const [serverError, setServerError] = useState<string | null>(
        null
    );

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email:
                localStorage.getItem(STORAGE_KEYS.SUBMITTED_EMAIL) ||
                '',
        },
    });

    useEffect(() => {
        const checkCooldown = () => {
            const savedEndTime = localStorage.getItem(
                STORAGE_KEYS.COOLDOWN_END
            );
            if (savedEndTime) {
                const endTime = parseInt(savedEndTime, 10);
                const now = Date.now();
                const remainingSeconds = Math.max(
                    0,
                    Math.floor((endTime - now) / 1000)
                );

                if (remainingSeconds > 0) {
                    setTimer(remainingSeconds);
                } else {
                    localStorage.removeItem(
                        STORAGE_KEYS.COOLDOWN_END
                    );
                    setTimer(0);
                }
            }
        };

        checkCooldown();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        localStorage.removeItem(
                            STORAGE_KEYS.COOLDOWN_END
                        );
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const sendRecoveryEmail = async (email: string) => {
        setServerError(null);
        try {
            await recoverPassword(email);

            const cooldownEndTime =
                Date.now() + COOLDOWN_SECONDS * 1000;
            const newTrialsCount = trialsCount + 1;

            localStorage.setItem(
                STORAGE_KEYS.COOLDOWN_END,
                cooldownEndTime.toString()
            );
            localStorage.setItem(
                STORAGE_KEYS.TRIALS_COUNT,
                newTrialsCount.toString()
            );
            localStorage.setItem(STORAGE_KEYS.SUBMITTED_EMAIL, email);

            setIsSubmitted(true);
            setTrialsCount(newTrialsCount);
            setTimer(COOLDOWN_SECONDS);
            setValue('email', email);
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
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Reset Password
            </h2>
            <p className="text-sm text-slate-600 mb-6">
                Enter your email address and we will send you a link
                to reset your password.
            </p>

            {serverError && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-md">
                    {serverError}
                </div>
            )}

            {isSubmitted && (
                <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
                    If an account exists with this email, we’ve sent a
                    password reset link.
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
            >
                <div>
                    <Input
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        disabled={isSubmitted}
                        className="w-full border border-slate-300 p-2.5 rounded-md focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-slate-100"
                        placeholder="name@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting
                            ? 'Sending Link...'
                            : 'Send Reset Link'}
                    </button>
                ) : (
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={
                                timer > 0 ||
                                trialsCount >= MAX_TRIALS ||
                                isSubmitting
                            }
                            className="w-full bg-slate-800 text-white py-2.5 rounded-md font-semibold hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
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

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="text-xs text-primary font-semibold hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
