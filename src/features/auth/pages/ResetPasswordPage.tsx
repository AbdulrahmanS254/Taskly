import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router';
import {
    resetPasswordSchema,
    type ResetPasswordData,
} from '../schemas/resetPasswordSchema';
import { updatePassword } from '../services/authService';

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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    });

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
        } catch (error: any) {
            setServerError(
                error.message ||
                    'Failed to update password. Please try again.'
            );
        }
    };

    if (!isLinkValid) {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">
                    Invalid Link
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                    Invalid or expired reset link.
                </p>
                <Link
                    to="/forgot-password"
                    className="text-xs text-primary font-semibold hover:underline"
                >
                    Request a new password reset link
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Set New Password
            </h2>
            <p className="text-sm text-slate-600 mb-6">
                Please enter your new password below.
            </p>

            {serverError && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-md">
                    {serverError}
                </div>
            )}

            {isSuccess ? (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md text-center">
                    Your password has been updated successfully. You
                    can now log in.
                    <p className="text-xs text-slate-500 mt-2">
                        Redirecting to login...
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full border border-slate-300 p-2.5 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className="w-full border border-slate-300 p-2.5 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting
                            ? 'Updating Password...'
                            : 'Reset Password'}
                    </button>
                </form>
            )}
        </div>
    );
}
