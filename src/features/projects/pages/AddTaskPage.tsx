import { useNavigate, useParams } from 'react-router';

import {
    IconCalendar,
    IconChevronRight,
} from '../../../components/ui/icons';

/**
 * Status values are a fixed enum (not API data), so they live here as markup.
 * Keep the `value`s in sync with STATUS_VALUES in schemas/taskSchema.ts.
 */
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

export default function AddTaskPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

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
                {/* TODO: wire up onSubmit --> onSubmit={handleSubmit(yourSubmitHandler)} */}
                <form noValidate className="flex flex-col gap-8">
                    {/* TODO: render a server/submit error banner here if you need one */}

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className={fieldLabel}>
                            Title{' '}
                            <span className="text-error">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g., Finalize structural schematics"
                            // TODO: wire up register('title')
                            className={`${fieldBase} px-4 py-4 text-lg font-medium`}
                        />
                        {/* TODO: render errors.title?.message here */}
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
                                name="status"
                                defaultValue="TO_DO"
                                // TODO: wire up register('status')
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
                            {/* TODO: render errors.status?.message here */}
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
                                name="assignee_id"
                                defaultValue=""
                                // TODO: wire up register('assignee_id')
                                style={selectChevron}
                                className={`${fieldBase} h-12 cursor-pointer appearance-none bg-size-[12px] bg-position-[right_1rem_center] bg-no-repeat px-4 pr-12 text-base`}
                            >
                                <option value="">
                                    Select Team Member
                                </option>
                                {/* TODO: map project members from the API into <option> elements */}
                            </select>
                            {/* TODO: render errors.assignee_id?.message here */}
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
                            name="epic_id"
                            defaultValue=""
                            // TODO: wire up register('epic_id')
                            style={selectChevron}
                            className={`${fieldBase} h-12 cursor-pointer appearance-none bg-size-[12px] bg-position-[right_1rem_center] bg-no-repeat px-4 pr-12 text-base`}
                        >
                            <option value="">Select Epic Link</option>
                            {/* TODO: map project epics from the API into <option> elements */}
                        </select>
                        {/* TODO: render errors.epic_id?.message here */}
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
                                name="due_date"
                                type="date"
                                // TODO: wire up register('due_date')
                                className={`${fieldBase} h-12 cursor-pointer px-4 pr-12 text-base [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-12 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                            />
                            <IconCalendar
                                aria-hidden="true"
                                className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-900"
                            />
                        </div>
                        {/* TODO: render errors.due_date?.message here */}
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
                            name="description"
                            rows={5}
                            placeholder="Provide detailed context for this task..."
                            // TODO: wire up register('description')
                            className={`${fieldBase} h-36 resize-none px-4 py-3 text-base leading-6`}
                        />
                        {/* TODO: render errors.description?.message here */}
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
                            className="rounded px-6 py-3 text-base font-medium text-slate-500 transition hover:bg-surface-low cursor-pointer"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="rounded-xs bg-linear-to-br from-primary to-primary-container px-8 py-3 text-base font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
