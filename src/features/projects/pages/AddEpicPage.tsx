import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';

import { addEpicSchema, type CreateEpicFormData } from '../schemas/epicSchema';
import { createEpic } from '../services/epicService';
import { getProjectById } from '../services/projectService';
import {
    getProjectMembers,
    type ProjectMember,
} from '../services/membersService';
import {
    IconSuccess,
    IconChevronRight,
    IconAlert,
    IconEpics,
    IconLightbulb,
    IconCalendar,
} from '../../../components/ui/icons';

export default function AddEpicPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [projectName, setProjectName] = useState<string | null>(null);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const deadlineRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateEpicFormData>({
        resolver: zodResolver(addEpicSchema),
        defaultValues: {
            title: '',
            description: '',
            assignee_id: '',
            project_id: projectId || '',
            deadline: '',
        },
    });

    // Ensure project_id stays updated in form state if param loads late
    useEffect(() => {
        if (projectId) {
            setValue('project_id', projectId);
        }
    }, [projectId, setValue]);

    const description = watch('description') ?? '';
    const { ref: deadlineFieldRef, ...deadlineField } = register('deadline');

    // Fetch project name (for breadcrumb) and project members (for assignee select)
    useEffect(() => {
        if (!projectId) return;

        getProjectById(projectId)
            .then((project) => setProjectName(project.name))
            .catch(() => setProjectName(null));

        setIsLoadingMembers(true);
        getProjectMembers(projectId)
            .then((data) => setMembers(data))
            .catch(() => setMembers([]))
            .finally(() => setIsLoadingMembers(false));
    }, [projectId]);

    useEffect(() => {
        if (!showSuccess) return;
        const timeout = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(timeout);
    }, [showSuccess]);

    const onSubmit = async (data: CreateEpicFormData) => {
        if (!projectId) return;
        setServerError(null);
        try {
            await createEpic(data);
            reset({
                title: '',
                description: '',
                assignee_id: '',
                project_id: projectId,
                deadline: '',
            });
            setShowSuccess(true);
        } catch (error: any) {
            const isNetworkError = error?.message?.includes('Failed to fetch');
            setServerError(
                isNetworkError
                    ? 'Unable to connect. Please try again later.'
                    : error?.message || 'Failed to create epic.'
            );
        }
    };

    return (
        <div className="relative">
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-white border border-slate-300/30 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-lg px-5 py-4 flex items-center gap-3">
                    <IconSuccess />
                    <span className="text-sm font-medium text-slate-900">
                        Epic created successfully.
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
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500/60">
                            {projectName || 'Project'}
                        </span>
                        <IconChevronRight />
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500/60">
                            Epics
                        </span>
                        <IconChevronRight />
                        <span className="text-xs font-bold uppercase tracking-[1.2px] text-primary">
                            New Epic
                        </span>
                    </div>
                    <h1 className="text-[36px] leading-10 font-semibold text-slate-900 tracking-[-0.9px]">
                        Create New Epic
                    </h1>
                    <p className="text-base text-slate-500 max-w-lg -mt-2">
                        Group large initiatives and assign ownership within this project.
                    </p>
                </div>
            </div>

            <div className="md:bg-white md:rounded-lg md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] md:max-w-2xl md:mx-auto overflow-hidden">
                <div className="md:border-b md:border-surface-low md:px-8 md:pt-8 md:pb-10 mb-8 md:mb-0">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center justify-center bg-surface-highest rounded-lg size-11 shrink-0">
                            <IconEpics />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Create New Epic
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Describe the epic, assign an owner, and set an optional deadline.
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

                    {/* Hidden Project ID input */}
                    <input type="hidden" {...register('project_id')} />

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.55px] text-slate-500">
                            Title <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Design & Implementation Phase 1"
                            {...register('title')}
                            className={`w-full bg-surface-highest border-2 rounded-lg md:rounded px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-muted focus:outline-none focus:border-primary transition ${
                                errors.title
                                    ? 'border-error'
                                    : 'border-transparent'
                            }`}
                        />
                        {errors.title && (
                            <div className="flex items-center gap-1.5">
                                <IconAlert className="size-3.5 text-error shrink-0" />
                                <p className="text-error text-xs font-medium">
                                    {errors.title.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
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
                            placeholder="Describe the overall scope and objectives of this epic..."
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

                    {/* Assignee & Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.55px] text-slate-500">
                                Assignee
                            </label>
                            <select
                                {...register('assignee_id')}
                                disabled={isLoadingMembers}
                                defaultValue=""
                                className="w-full bg-surface-highest border-2 border-transparent rounded-lg md:rounded px-4 py-3 h-12 text-base text-slate-900 focus:outline-none focus:border-primary transition disabled:opacity-60 appearance-none bg-no-repeat bg-position-[right_1rem_center] bg-size-[12px] cursor-pointer"
                                style={{
                                    backgroundImage:
                                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23434654' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                                }}
                            >
                                <option value="">
                                    {isLoadingMembers
                                        ? 'Loading members...'
                                        : 'Unassigned'}
                                </option>
                                {members.map((member) => (
                                    <option
                                        key={member.member_id}
                                        value={member.member_id}
                                    >
                                        {member.metadata?.name || member.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.55px] text-slate-500">
                                Deadline
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...deadlineField}
                                    ref={(el) => {
                                        deadlineFieldRef(el);
                                        deadlineRef.current = el;
                                    }}
                                    className="w-full bg-surface-highest border-2 border-transparent rounded-lg md:rounded px-4 py-3 h-12 text-base text-slate-900 focus:outline-none focus:border-primary transition [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() =>
                                        deadlineRef.current?.showPicker?.()
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                                >
                                    <IconCalendar className="size-4" />
                                </button>
                            </div>
                            {errors.deadline && (
                                <p className="text-error text-xs font-medium">
                                    {errors.deadline.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 pt-2 md:pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full md:w-auto text-center text-slate-500 font-bold text-sm px-6 py-3 rounded-lg md:rounded cursor-pointer hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-bold text-sm px-8 py-4 md:py-3 rounded-lg md:rounded shadow-[0px_10px_15px_-3px_rgba(0,61,155,0.2),0px_4px_6px_-4px_rgba(0,61,155,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Epic'}
                        </button>
                    </div>
                </form>

                <div className="mt-12 md:mt-0 bg-surface-low rounded-lg md:rounded-none p-6 flex flex-col md:flex-row gap-2 md:gap-3 md:items-start">
                    <IconLightbulb className="hidden md:block text-slate-500 shrink-0 mt-1" />
                    <p className="text-xs font-bold text-slate-500 md:hidden">
                        Pro Tip
                    </p>
                    <p className="text-xs md:text-[12px] text-slate-500">
                        <span className="hidden md:inline font-bold">
                            Pro Tip:{' '}
                        </span>
                        You can create epics first to organize high-level milestones, then link individual tasks to them later.
                    </p>
                </div>
            </div>
        </div>
    );
}