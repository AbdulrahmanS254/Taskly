import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';

import {
    addProjectSchema,
    type AddProjectData,
} from '../../auth/schemas/commonSchemas';
import {
    getProjectById,
    updateProject,
} from '../services/projectService';
import { IconSuccess, IconChevronRight, IconAlert, IconProjectCheck, IconLightbulb } from '../../../components/ui/icons';

export default function EditProjectPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [isLoadingProject, setIsLoadingProject] = useState(true);
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

    // Fetch initial project data on mount
    useEffect(() => {
        if (!projectId) return;

        setIsLoadingProject(true);
        getProjectById(projectId)
            .then((project) => {
                reset({
                    name: project.name,
                    description: project.description || '',
                });
            })
            .catch((error: any) => {
                const isNetworkError =
                    error?.message?.includes('Failed to fetch');
                setServerError(
                    isNetworkError
                        ? 'Unable to connect. Please try again later.'
                        : error?.message ||
                              'Failed to fetch project details.'
                );
            })
            .finally(() => {
                setIsLoadingProject(false);
            });
    }, [projectId, reset]);

    // Handle auto-hiding success toast
    useEffect(() => {
        if (!showSuccess) return;
        const timeout = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(timeout);
    }, [showSuccess]);

    const onSubmit = async (data: AddProjectData) => {
        if (!projectId) return;
        setServerError(null);

        try {
            await updateProject(projectId, data);
            setShowSuccess(true);
        } catch (error: any) {
            const isNetworkError =
                error?.message?.includes('Failed to fetch');
            setServerError(
                isNetworkError
                    ? 'Unable to connect. Please try again later.'
                    : error?.message || 'Failed to update project.'
            );
        }
    };

    if (isLoadingProject) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-slate-500 font-medium">
                    Loading project details...
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-300/30 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-lg px-5 py-4 flex items-center gap-3">
                    <IconSuccess />
                    <span className="text-sm font-medium text-slate-900">
                        Project updated successfully.
                    </span>
                </div>
            )}

            {/* Breadcrumb Header */}
            <div className="md:flex items-end justify-between mb-6 hidden">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500/60">
                            Projects
                        </span>
                        <IconChevronRight />
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-primary">
                            Edit Project
                        </span>
                    </div>
                    <h1 className="text-[36px] leading-10 font-semibold text-slate-900 tracking-[-0.9px]">
                        Edit Project
                    </h1>
                </div>
            </div>

            <div className="md:bg-white md:rounded-lg md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] md:max-w-2xl md:mx-auto overflow-hidden">
                <div className="md:border-b md:border-surface-low md:px-8 md:pt-8 md:pb-10 mb-8 md:mb-0">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center justify-center bg-surface-highest rounded-lg size-11 shrink-0">
                            <IconProjectCheck />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Update Project Details
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Modify the name and description of
                                your project.
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
                                <IconAlert className="size-3.5 text-error shrink-0" />
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
                            onClick={() => navigate('/project')}
                            className="w-full md:w-auto text-center text-slate-500 font-bold text-sm px-6 py-3 rounded-lg md:rounded cursor-pointer hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-bold text-sm px-8 py-4 md:py-3 rounded-lg md:rounded shadow-[0px_10px_15px_-3px_rgba(0,0,61,0.2),0px_4px_6px_-4px_rgba(0,0,61,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <div className="mt-12 md:mt-0 bg-surface-low rounded-lg md:rounded-none p-6 md:p-6 flex flex-col md:flex-row gap-2 md:gap-3 md:items-start">
                    <IconLightbulb className="hidden md:block text-slate-500 shrink-0 mt-1" />
                    <p className="text-xs font-bold text-slate-500 md:hidden">
                        Pro Tip
                    </p>
                    <p className="text-xs md:text-[12px] text-slate-500">
                        <span className="hidden md:inline font-bold">
                            Pro Tip:{' '}
                        </span>
                        Updating the project details will be reflected
                        across all project epics and assigned tasks
                        immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
