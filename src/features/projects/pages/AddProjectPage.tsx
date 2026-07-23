import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import {
    addProjectSchema,
    type AddProjectData,
} from '../../auth/schemas/commonSchemas';
import { createProject } from '../services/projectService';

export default function AddProjectPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(
        null
    );
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AddProjectData>({
        resolver: zodResolver(addProjectSchema),
        defaultValues: { name: '', description: '' },
    });

    const description = watch('description') ?? '';

    useEffect(() => {
        if (!showSuccess) return;
        const timeout = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(timeout);
    }, [showSuccess]);

    const onSubmit = async (data: AddProjectData) => {
        setServerError(null);
        try {
            await createProject(data);
            reset();
            setShowSuccess(true);
        } catch (error: any) {
            const isNetworkError =
                error?.message?.includes('Failed to fetch');
            // making sure it's not a network error
            setServerError(
                isNetworkError
                    ? 'Unable to connect. Please try again later.'
                    : error?.message || 'Failed to create project.'
            );
        }
    };

    return (
        <div className="relative">
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-300/30 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-lg px-5 py-4 flex items-center gap-3">
                    <svg
                        className="size-5 text-success shrink-0"
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
                    <span className="text-sm font-medium text-slate-900">
                        Project created successfully.
                    </span>
                </div>
            )}

            {/* breadcrump Need to be created as component */}
            <div className="md:flex items-end justify-between mb-6 hidden">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500/60">
                            Projects
                        </span>
                        <svg
                            className="size-2.5 text-slate-500/60"
                            viewBox="0 0 8 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2 1l4 3-4 3"
                            />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-primary">
                            Add New Project
                        </span>
                    </div>
                    <h1 className="text-[36px] leading-10 font-semibold text-slate-900 tracking-[-0.9px]">
                        Add New Project
                    </h1>
                </div>
            </div>

            <div className="md:bg-white md:rounded-lg md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] md:max-w-2xl md:mx-auto overflow-hidden">
                <div className="md:border-b md:border-surface-low md:px-8 md:pt-8 md:pb-10 mb-8 md:mb-0">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center justify-center bg-surface-highest rounded-lg size-11 shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="20"
                                viewBox="0 0 22 20"
                                fill="none"
                            >
                                <path
                                    d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.0833 0 12.1083 0.158333 13.075 0.475C14.0417 0.791667 14.9333 1.23333 15.75 1.8L14.3 3.275C13.6667 2.875 12.9917 2.5625 12.275 2.3375C11.5583 2.1125 10.8 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18C10.5333 18 11.05 17.95 11.55 17.85C12.05 17.75 12.5333 17.6083 13 17.425L14.5 18.95C13.8167 19.2833 13.1 19.5417 12.35 19.725C11.6 19.9083 10.8167 20 10 20ZM17 18V15H14V13H17V10H19V13H22V15H19V18H17ZM8.6 14.6L4.35 10.35L5.75 8.95L8.6 11.8L18.6 1.775L20 3.175L8.6 14.6Z"
                                    fill="#0052CC"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Initialize New Project
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Define the scope and foundational
                                details of your project.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="md:p-8 space-y-6 md:space-y-8"
                >
                    {serverError && (
                        <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-md font-medium">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.55px] text-slate-500">
                            Project Title{' '}
                            <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Architectural Redesign Q3"
                            {...register('name')}
                            className={`w-full bg-surface-highest border-2 rounded-lg md:rounded px-4 py-3.5 md:py-3.5 text-base text-slate-900 placeholder:text-slate-muted focus:outline-none focus:border-primary transition ${
                                errors.name
                                    ? 'border-error'
                                    : 'border-transparent'
                            }`}
                        />
                        {errors.name && (
                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="size-3.5 text-error shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <circle cx="10" cy="10" r="7.5" />
                                    <path
                                        strokeLinecap="round"
                                        d="M10 6.5v4M10 13v.01"
                                    />
                                </svg>
                                <p className="text-error text-xs font-medium">
                                    {errors.name.message}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.55px] text-slate-500">
                                Description
                            </label>
                            <span className="text-[11px] text-slate-500/60">
                                Optional
                            </span>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                            {...register('description')}
                            className={`w-full bg-surface-highest border-2 rounded-lg md:rounded px-4 py-4 text-base text-slate-900 placeholder:text-slate-muted/70 focus:outline-none focus:border-primary transition resize-none ${
                                errors.description
                                    ? 'border-error'
                                    : 'border-transparent'
                            }`}
                        />
                        <div className="flex items-center justify-between">
                            {errors.description ? (
                                <p className="text-error text-xs font-medium">
                                    {errors.description.message}
                                </p>
                            ) : (
                                <span />
                            )}
                            <span className="text-[11px] text-slate-500">
                                {description.length} / 500 characters
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 pt-2 md:pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full md:w-auto text-center text-slate-500 font-bold text-sm px-6 py-3 rounded-lg md:rounded cursor-pointer"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-bold text-sm px-8 py-4 md:py-3 rounded-lg md:rounded shadow-[0px_10px_15px_-3px_rgba(0,61,155,0.2),0px_4px_6px_-4px_rgba(0,61,155,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting
                                ? 'Creating...'
                                : 'Create Project'}
                        </button>
                    </div>
                </form>

                <div className="mt-12 md:mt-0 bg-surface-low rounded-lg md:rounded-none p-6 md:p-6 flex flex-col md:flex-row gap-2 md:gap-3 md:items-start">
                    <svg
                        className="hidden md:block size-3.5 text-slate-500 shrink-0 mt-1"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M10 2.5a5 5 0 00-3 9v1.5a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V11.5a5 5 0 00-3-9z" />
                        <path strokeLinecap="round" d="M8.5 17h3" />
                    </svg>
                    <p className="text-xs font-bold text-slate-500 md:hidden">
                        Pro Tip
                    </p>
                    <p className="text-xs md:text-[12px] text-slate-500">
                        <span className="hidden md:inline font-bold">
                            Pro Tip:{' '}
                        </span>
                        You can invite project members and assign
                        epics immediately after the initial creation
                        process.
                    </p>
                </div>
            </div>
        </div>
    );
}
