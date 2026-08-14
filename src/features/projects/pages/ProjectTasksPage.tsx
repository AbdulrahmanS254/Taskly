import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router';

import { getTasksByStatus, type Task } from '../services/taskService';
import { STATUS_VALUES } from '../schemas/taskSchema';
import { getInitials } from '../../../utils/helpers';
import { IconPlus, IconTasks } from '../../../components/ui/icons';

type TaskStatus = (typeof STATUS_VALUES)[number];

interface StatusMeta {
    label: string;
    dot: string;
    badgeBg: string;
    badgeText: string;
}

const STATUS_META: Record<TaskStatus, StatusMeta> = {
    TO_DO: {
        label: 'To Do',
        dot: 'bg-[#94a3b8]',
        badgeBg: 'bg-[#e0e8ff]',
        badgeText: 'text-slate-900',
    },
    IN_PROGRESS: {
        label: 'In Progress',
        dot: 'bg-primary-container',
        badgeBg: 'bg-primary-container/10',
        badgeText: 'text-primary',
    },
    BLOCKED: {
        label: 'Blocked',
        dot: 'bg-error',
        badgeBg: 'bg-[#ffdad6]',
        badgeText: 'text-[#93000a]',
    },
    IN_REVIEW: {
        label: 'In Review',
        dot: 'bg-slate-500',
        badgeBg: 'bg-[#e0e8ff]',
        badgeText: 'text-slate-900',
    },
    READY_FOR_QA: {
        label: 'Ready for QA',
        dot: 'bg-[#0c56d0]',
        badgeBg: 'bg-[#0c56d0]/10',
        badgeText: 'text-[#0c56d0]',
    },
    REOPENED: {
        label: 'Reopened',
        dot: 'bg-error',
        badgeBg: 'bg-[#ffdad6]',
        badgeText: 'text-[#93000a]',
    },
    READY_FOR_PRODUCTION: {
        label: 'Ready for Prod',
        dot: 'bg-[#004e32]',
        badgeBg: 'bg-[#004e32]/10',
        badgeText: 'text-[#004e32]',
    },
    DONE: {
        label: 'Done',
        dot: 'bg-[#65dca4]',
        badgeBg: 'bg-success',
        badgeText: 'text-[#002113]',
    },
};

// Date-only strings (YYYY-MM-DD) parsed with `new Date()` are read as UTC
// midnight, which shifts the day back in negative-offset timezones.
function parseDateOnly(value: string): Date {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return new Date(value);
    return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
    );
}

function formatShortDate(dateString: string): string {
    const date = parseDateOnly(dateString);
    const month = date
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();
    return `${month} ${String(date.getDate()).padStart(2, '0')}`;
}

interface DueMeta {
    label: string;
    className: string;
}

function getDueMeta(
    dueDate: string | null,
    isDone: boolean
): DueMeta | null {
    if (isDone)
        return { label: 'COMPLETED', className: 'text-[#004e32]' };
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = parseDateOnly(dueDate);

    if (due.getTime() < today.getTime()) {
        return { label: 'OVERDUE', className: 'text-error' };
    }
    if (due.getTime() === today.getTime()) {
        return { label: 'TODAY', className: 'text-primary' };
    }
    return {
        label: formatShortDate(dueDate),
        className: 'text-[#94a3b8]',
    };
}

export default function ProjectTasksPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const view =
        searchParams.get('view') === 'list' ? 'list' : 'board';

    const handleViewChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const next = event.target.value;
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (next === 'board') params.delete('view');
            else params.set('view', next);
            return params;
        });
    };

    const handleAddTask = (status: TaskStatus) => {
        navigate(`/project/${projectId}/tasks/new?status=${status}`);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Active Workboard
                    </h1>
                    <p className="text-sm text-slate-500">
                        Curating this project's production pipeline
                        and milestones.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="search"
                        placeholder="Search tasks..."
                        className="h-11 w-full rounded bg-surface-highest pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-primary md:w-64"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23737685' stroke-width='1.5'%3E%3Ccircle cx='9' cy='9' r='6'/%3E%3Cpath stroke-linecap='round' d='M17 17l-3.5-3.5'/%3E%3C/svg%3E\")",
                            backgroundSize: '16px',
                            backgroundPosition: 'left 12px center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />

                    <select
                        value={view}
                        onChange={handleViewChange}
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23041b3c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            backgroundSize: '10px',
                            backgroundPosition: 'right 14px center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        className="h-11 cursor-pointer appearance-none rounded border border-slate-300/20 bg-white pl-4 pr-9 text-sm font-medium text-slate-900 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="board">Board View</option>
                        <option value="list">List View</option>
                    </select>
                </div>
            </div>

            {view === 'board' ? (
                <BoardView
                    projectId={projectId ?? ''}
                    onAddTask={handleAddTask}
                />
            ) : (
                <ListView />
            )}
        </div>
    );
}

function BoardView({
    projectId,
    onAddTask,
}: {
    projectId: string;
    onAddTask: (status: TaskStatus) => void;
}) {
    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {STATUS_VALUES.map((status) => (
                <TaskColumn
                    key={status}
                    projectId={projectId}
                    status={status}
                    onAddTask={onAddTask}
                />
            ))}
        </div>
    );
}

function ListView() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white py-24 text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium text-slate-500">
                List view is coming soon.
            </p>
        </div>
    );
}

function TaskColumn({
    projectId,
    status,
    onAddTask,
}: {
    projectId: string;
    status: TaskStatus;
    onAddTask: (status: TaskStatus) => void;
}) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const meta = STATUS_META[status];

    useEffect(() => {
        if (!projectId) return;

        let cancelled = false;

        getTasksByStatus(projectId, status)
            .then((data) => {
                if (!cancelled) setTasks(data);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [projectId, status]);

    return (
        <div className="flex w-72 shrink-0 flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span
                        className={`size-2 shrink-0 rounded-full ${meta.dot}`}
                    />
                    <h3 className="text-[11px] font-bold uppercase tracking-[1.1px] text-slate-500">
                        {meta.label}
                    </h3>
                    {!loading && !error && tasks.length > 0 && (
                        <span
                            className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${meta.badgeBg} ${meta.badgeText}`}
                        >
                            {tasks.length}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onAddTask(status)}
                    aria-label={`Add task to ${meta.label}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded text-slate-muted transition hover:bg-surface-low hover:text-primary cursor-pointer"
                >
                    <IconPlus className="size-3" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {loading &&
                    Array.from({ length: 2 }).map((_, i) => (
                        <TaskCardSkeleton key={i} />
                    ))}

                {!loading && error && (
                    <p className="rounded-lg border border-dashed border-slate-300/30 bg-surface-low/50 px-4 py-6 text-center text-xs font-medium text-error">
                        Failed to load tasks
                    </p>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300/30 bg-surface-low/30 px-4 py-8">
                        <IconTasks className="size-5 text-slate-muted" />
                        <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-slate-muted">
                            No Items
                        </span>
                    </div>
                )}

                {!loading &&
                    !error &&
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            isDone={status === 'DONE'}
                        />
                    ))}
            </div>
        </div>
    );
}

function TaskCard({ task, isDone }: { task: Task; isDone: boolean }) {
    const dueMeta = getDueMeta(task.due_date, isDone);
    const isOverdue = dueMeta?.label === 'OVERDUE';

    return (
        <div
            className={`flex flex-col gap-4 rounded-lg border p-4 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] ${
                isOverdue
                    ? 'border-error/10 bg-error/5'
                    : 'border-slate-300/10 bg-white'
            } ${isDone ? 'opacity-60' : ''}`}
        >
            <h4
                className={`text-sm font-medium text-slate-900 ${
                    isDone ? 'line-through' : ''
                }`}
            >
                {task.title}
            </h4>
            <div className="flex items-center justify-between gap-2">
                {dueMeta ? (
                    <span
                        className={`text-[10px] font-bold ${dueMeta.className}`}
                    >
                        {dueMeta.label}
                    </span>
                ) : (
                    <span />
                )}
                {task.assignee?.name && (
                    <div
                        title={task.assignee.name}
                        className="flex size-6 shrink-0 items-center justify-center rounded-xl border border-white bg-surface-highest text-[10px] font-bold text-slate-900"
                    >
                        {getInitials(task.assignee.name)}
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskCardSkeleton() {
    const bar = 'bg-[#e8edff] rounded-sm';

    return (
        <div className="flex animate-pulse flex-col gap-4 rounded-lg border border-slate-300/10 bg-white p-4">
            <div className={`h-4 w-4/5 ${bar}`} />
            <div className="flex items-center justify-between">
                <div className={`h-2.5 w-12 ${bar}`} />
                <div className={`size-6 rounded-xl ${bar}`} />
            </div>
        </div>
    );
}
