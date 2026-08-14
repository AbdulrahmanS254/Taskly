import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';

import {
    addTaskSchema,
    STATUS_VALUES,
    type CreateTaskFormData,
} from '../schemas/taskSchema';
import { createTask } from '../services/taskService';
import { getProjectEpics, type Epic } from '../services/epicService';
import {
    getProjectMembers,
    type ProjectMember,
} from '../services/membersService';
import {
    IconCalendar,
    IconChevronRight,
} from '../../../components/ui/icons';

const STATUS_OPTIONS = [
    { value: 'TO_DO', label: 'TO DO' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
    { value: 'BLOCKED', label: 'BLOCKED' },
    { value: 'IN_REVIEW', label: 'IN REVIEW' },
    { value: 'READY_FOR_QA', label: 'READY FOR QA' },
    { value: 'REOPENED', label: 'REOPENED' },
    { value: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION' },
    { value: 'DONE', label: 'DONE' },
];

const fieldLabel =
    'text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#434654]';

const fieldBase =
    'w-full bg-surface-highest rounded border-0 text-slate-900 placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out';

// Native selects can't style their arrow, so the chevron is a background image
// (same approach as AddEpicPage).
const selectChevron = {
    backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23041b3c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
};

// getProjectEpics is paginated; the dropdown wants them all in one call.
const EPIC_OPTIONS_LIMIT = 100;

function isValidStatus(
    value: string | null
): value is (typeof STATUS_VALUES)[number] {
    return (
        value !== null &&
        (STATUS_VALUES as readonly string[]).includes(value)
    );
}

export default function AddTaskPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams] = useSearchParams();

    const statusParam = searchParams.get('status');
    const initialStatus = isValidStatus(statusParam)
        ? statusParam
        : 'TO_DO';

    const [epics, setEpics] = useState<Epic[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [isLoadingEpics, setIsLoadingEpics] = useState(true);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<
        z.input<typeof addTaskSchema>,
        unknown,
        CreateTaskFormData
    >({
        resolver: zodResolver(addTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: initialStatus,
            assignee_id: '',
            epic_id: '',
            due_date: '',
        },
    });

    useEffect(() => {
        if (!projectId) return;

        getProjectEpics(projectId, 1, EPIC_OPTIONS_LIMIT)
            .then(({ epics: data }) => setEpics(data))
            .catch(() => setEpics([]))
            .finally(() => setIsLoadingEpics(false));

        getProjectMembers(projectId)
            .then((data) => setMembers(data))
            .catch(() => setMembers([]))
            .finally(() => setIsLoadingMembers(false));
    }, [projectId]);

    const onSubmit = async (data: CreateTaskFormData) => {
        if (!projectId) return;

        try {
            await createTask(projectId, data);
            toast.success('Task created');
            navigate(`/project/${projectId}/tasks`);
        } catch (error: unknown) {
            toast.error(
                error instanceof Error && error.message
                    ? error.message
                    : 'Failed to create task. Please try again.'
            );
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Breadcrumb */}
            <nav
                aria-label="Breadcrumb"
                className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.55px]"
            >
                <span className="text-slate-muted">Projects</span>
                <IconChevronRight />
                <span className="text-slate-muted">
                    {/* TODO: wire up real project name */}
                    Project
                </span>
                <IconChevronRight />
                <span className="text-slate-muted">Tasks</span>
                <IconChevronRight />
                <span className="text-slate-900">New Task</span>
            </nav>

            {/* Page header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-[32px] font-semibold leading-10 text-slate-900">
                    Create New Task
                </h1>
                <p className="text-sm leading-5.25 text-[#434654]">
                    Initialize a new work item within the
                    Architectural Workspace ecosystem.
                </p>
            </header>

            {/* Form card */}
            <div className="rounded-lg bg-white p-4 shadow-[0px_24px_48px_-12px_rgba(4,27,60,0.06)] md:p-6">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-8"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className={fieldLabel}>
                            Title{' '}
                            <span className="text-error">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g., Finalize structural schematics"
                            {...register('title')}
                            className={`${fieldBase} px-4 py-4 text-lg font-medium`}
                        />
                        {errors.title && (
                            <p className="text-xs font-medium text-error">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Status + Assignee */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="status"
                                className={fieldLabel}
                            >
                                Status{' '}
                                <span className="text-error">*</span>
                            </label>
                            <select
                                id="status"
                                {...register('status')}
                                style={selectChevron}
                                className={`${fieldBase} h-12 cursor-pointer appearance-none bg-size-[12px] bg-position-[right_1rem_center] bg-no-repeat px-4 pr-12 text-base`}
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="text-xs font-medium text-error">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="assignee_id"
                                className={fieldLabel}
                            >
                                Assignee
                            </label>
                            <select
                                id="assignee_id"
                                {...register('assignee_id')}
                                disabled={isLoadingMembers}
                                style={selectChevron}
                                className={`${fieldBase} h-12 cursor-pointer appearance-none bg-size-[12px] bg-position-[right_1rem_center] bg-no-repeat px-4 pr-12 text-base`}
                            >
                                <option value="">
                                    {isLoadingMembers
                                        ? 'Loading members...'
                                        : 'Select Team Member'}
                                </option>
                                {members.map((member) => (
                                    <option
                                        key={member.member_id}
                                        value={member.user_id}
                                    >
                                        {member.metadata?.name ||
                                            member.email}
                                    </option>
                                ))}
                            </select>
                            {errors.assignee_id && (
                                <p className="text-xs font-medium text-error">
                                    {errors.assignee_id.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Epic */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="epic_id"
                            className={fieldLabel}
                        >
                            Epic
                        </label>
                        <select
                            id="epic_id"
                            {...register('epic_id')}
                            disabled={isLoadingEpics}
                            style={selectChevron}
                            className={`${fieldBase} h-12 cursor-pointer appearance-none bg-size-[12px] bg-position-[right_1rem_center] bg-no-repeat px-4 pr-12 text-base`}
                        >
                            <option value="">
                                {isLoadingEpics
                                    ? 'Loading epics...'
                                    : 'Select Epic Link'}
                            </option>
                            {epics.map((epic) => (
                                <option key={epic.id} value={epic.id}>
                                    {epic.epic_id} — {epic.title}
                                </option>
                            ))}
                        </select>
                        {errors.epic_id && (
                            <p className="text-xs font-medium text-error">
                                {errors.epic_id.message}
                            </p>
                        )}
                    </div>

                    {/* Due date */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="due_date"
                            className={fieldLabel}
                        >
                            Due Date
                        </label>
                        <div className="relative">
                            <input
                                id="due_date"
                                type="date"
                                {...register('due_date')}
                                className={`${fieldBase} h-12 cursor-pointer px-4 pr-12 text-base [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-12 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                            />
                            <IconCalendar
                                aria-hidden="true"
                                className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-900"
                            />
                        </div>
                        {errors.due_date && (
                            <p className="text-xs font-medium text-error">
                                {errors.due_date.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="description"
                            className={fieldLabel}
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            placeholder="Provide detailed context for this task..."
                            {...register('description')}
                            className={`${fieldBase} h-36 resize-none px-4 py-3 text-base leading-6`}
                        />
                        {errors.description && (
                            <p className="text-xs font-medium text-error">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-4 pt-6 md:flex-row md:items-center md:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/project/${projectId}/tasks`
                                )
                            }
                            disabled={isSubmitting}
                            className="rounded px-6 py-3 text-base font-medium text-slate-500 transition hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xs bg-linear-to-br from-primary to-primary-container px-8 py-3 text-base font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting
                                ? 'Creating...'
                                : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
