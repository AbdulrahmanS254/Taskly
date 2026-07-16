import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SignUpSchema } from '../schemas/signUpSchema';
import type { SignUpData } from '../schemas/signUpSchema';

import { Input } from '../../../components/ui/Input';

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpData>({
        resolver: zodResolver(SignUpSchema),
        mode: 'onTouched',
    });

    const onSubmit = async (data: SignUpData) => {
        try {
            console.log('Form Submitted Successfully:', data);
            // Api will be called here
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-[#0D2149] tracking-tight">
                    Create your workspace
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Join the editorial approach to task management.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
            >
                {/* Name */}
                <Input
                    label="Name"
                    placeholder="Enter your full name"
                    helperText="3-50 characters, letters only."
                    error={errors.name?.message}
                    {...register('name')}
                />

                {/* Email */}
                <Input
                    label="Email"
                    type="email"
                    placeholder="yourname@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                {/* Job Title */}
                <Input
                    label="Job Title (Optional)"
                    placeholder="e.g. Project Manager"
                    error={errors.jobTitle?.message}
                    {...register('jobTitle')}
                />

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Password"
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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-primary-container hover:bg-[#0043A4] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting
                        ? 'Creating Account...'
                        : 'Create Account'}
                </button>
            </form>
        </div>
    );
}
