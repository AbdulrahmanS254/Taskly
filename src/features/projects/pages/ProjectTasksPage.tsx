import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router';

import { getTasksByStatus, type Task } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { STATUS_VALUES } from '../schemas/taskSchema';
import { getInitials } from '../../../utils/helpers';
import {
    IconAlert,
    IconCalendar,
    IconChevronRight,
    IconPlus,
    IconSuccess,
    IconTasks,
} from '../../../components/ui/icons';

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
        badgeBg: 'bg-[#e0e8ff]',
        badgeText: 'text-slate-900',
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
        badgeBg: 'bg-[#e0e8ff]',
        badgeText: 'text-slate-900',
    },
    DONE: {
        label: 'Done',
        dot: 'bg-[#65dca4]',
        badgeBg: 'bg-success',
        badgeText: 'text-[#002113]',
    },
};

const boardIconUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' fill='%23041b3c'%3E%3Crect x='0' y='0' width='6' height='6' rx='1'/%3E%3Crect x='8' y='0' width='6' height='6' rx='1'/%3E%3Crect x='0' y='8' width='6' height='6' rx='1'/%3E%3Crect x='8' y='8' width='6' height='6' rx='1'/%3E%3C/svg%3E\")";

const listIconUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' fill='none' stroke='%23041b3c' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M1 3h12M1 7h12M1 11h12'/%3E%3C/svg%3E\")";

const chevronIconUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23041b3c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

const searchIconUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236b7280' stroke-width='1.75'%3E%3Ccircle cx='9' cy='9' r='6'/%3E%3Cpath stroke-linecap='round' d='M17 17l-3.5-3.5'/%3E%3C/svg%3E\")";

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

type DueTone = 'completed' | 'delayed' | 'today' | 'normal';

interface DueMeta {
    label: string;
    tone: DueTone;
    className: string;
}

function getDueMeta(
    dueDate: string | null,
    isDone: boolean
): DueMeta | null {
    if (isDone) {
        return {
            label: 'Completed',
            tone: 'completed',
            className: 'text-[#004e32]',
        };
    }
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = parseDateOnly(dueDate);

    if (due.getTime() < today.getTime()) {
        return {
            label: 'Delayed',
            tone: 'delayed',
            className: 'text-error',
        };
    }
    if (due.getTime() === today.getTime()) {
        return {
            label: 'Today',
            tone: 'today',
            className: 'text-primary',
        };
    }
    return {
        label: formatShortDate(dueDate),
        tone: 'normal',
        className: 'text-[#94a3b8]',
    };
}

export default function ProjectTasksPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [projectName, setProjectName] = useState<string | null>(
        null
    );

    const view =
        searchParams.get('view') === 'list' ? 'list' : 'board';

    useEffect(() => {
        if (!projectId) return;
        getProjectById(projectId)
            .then((project) => setProjectName(project.name))
            .catch(() => setProjectName(null));
    }, [projectId]);

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
        <div className="flex flex-col gap-8">
            {/* Breadcrumb */}
            <nav
                aria-label="Breadcrumb"
                className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px]"
            >
                <span className="text-[#64748b]">Projects</span>
                <IconChevronRight />
                <span className="text-[#64748b]">
                    {projectName || 'Project'}
                </span>
                <IconChevronRight />
                <span className="text-slate-900">Tasks</span>
            </nav>

            {/* Page header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[30px] font-semibold leading-9 tracking-[-0.75px] text-slate-900">
                        Active Workboard
                    </h1>
                    <p className="text-sm leading-5 text-[#64748b]">
                        Curating {projectName || 'this project'}'s
                        production pipeline and milestones.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="search"
                        placeholder="Search tasks..."
                        aria-label="Search tasks"
                        style={{
                            backgroundImage: searchIconUrl,
                            backgroundSize: '13.5px',
                            backgroundPosition: 'left 14px center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        className="h-10.5-full rounded bg-surface-highest pl-10 pr-4 text-sm text-slate-900 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary md:w-64"
                    />

                    <select
                        value={view}
                        onChange={handleViewChange}
                        aria-label="Switch view"
                        style={{
                            backgroundImage: `${
                                view === 'board'
                                    ? boardIconUrl
                                    : listIconUrl
                            }, ${chevronIconUrl}`,
                            backgroundSize: '13.5px, 9px',
                            backgroundPosition:
                                'left 17px center, right 17px center',
                            backgroundRepeat: 'no-repeat, no-repeat',
                        }}
                        className="h-10.5hrink-0 cursor-pointer appearance-none rounded border border-slate-300/20 bg-white pl-10 pr-11 text-sm font-medium text-slate-900 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div className="flex items-stretch gap-6 overflow-x-auto pb-4">
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

    const showCount = !loading && !error && tasks.length > 0;

    return (
        <div className="flex min-h-105 w-72 shrink-0 flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span
                        className={`size-2 shrink-0 rounded-full ${meta.dot}`}
                    />
                    <h3 className="text-[11px] font-bold uppercase leading-4 tracking-[1.1px] text-[#64748b]">
                        {meta.label}
                    </h3>
                    {showCount && (
                        <span
                            className={`rounded-xs px-1.5 py-0.5 text-[10px] font-bold leading-3.75 ${meta.badgeBg} ${meta.badgeText}`}
                        >
                            {tasks.length}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onAddTask(status)}
                    aria-label={`Add task to ${meta.label}`}
                    className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#64748b] transition hover:bg-surface-low hover:text-primary"
                >
                    <IconPlus className="size-2.5" />
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-3">
                {loading &&
                    Array.from({ length: 2 }).map((_, i) => (
                        <TaskCardSkeleton key={i} />
                    ))}

                {!loading && error && (
                    <p className="rounded-lg border-2 border-dashed border-slate-300/30 px-4 py-6 text-center text-xs font-medium text-error">
                        Failed to load tasks
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <button
                            type="button"
                            onClick={() => onAddTask(status)}
                            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300/30 py-4.5 text-xs font-bold uppercase tracking-[1.2px] text-[#434654]/60 transition hover:border-primary/40 hover:text-primary"
                        >
                            <IconPlus className="size-3.5" />
                            Add New Task
                        </button>

                        {tasks.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300/30 bg-surface-low/30 px-4 py-8">
                                <IconTasks className="size-7 text-[#94a3b8]" />
                                <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#94a3b8]">
                                    No Items
                                </span>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    status={status}
                                />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function TaskCard({
    task,
    status,
}: {
    task: Task;
    status: TaskStatus;
}) {
    const isDone = status === 'DONE';
    const dueMeta = getDueMeta(task.due_date, isDone);
    const isDelayed = dueMeta?.tone === 'delayed';
    const isActive = status === 'IN_PROGRESS';

    const container = isDelayed
        ? 'border border-error/10 bg-[#ffdad6]/20 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
        : isActive
          ? 'border border-l-4 border-primary bg-white drop-shadow-[0px_2px_4px_rgba(0,0,0,0.02)]'
          : 'border border-slate-300/10 bg-white drop-shadow-[0px_2px_4px_rgba(0,0,0,0.02)]';

    return (
        <div
            className={`flex shrink-0 flex-col gap-4 rounded-lg p-4 ${container} ${
                isDone ? 'opacity-60' : ''
            }`}
        >
            <h4
                className={`text-sm font-medium leading-[19.25px] text-slate-900 ${
                    isDone ? 'line-through' : ''
                }`}
            >
                {task.title}
            </h4>

            <div className="flex items-center justify-between gap-2">
                {dueMeta ? (
                    <span
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase leading-3.75 ${dueMeta.className}`}
                    >
                        {dueMeta.tone === 'completed' ? (
                            <IconSuccess className="size-2.5 shrink-0" />
                        ) : dueMeta.tone === 'delayed' ? (
                            <IconAlert className="size-2.5 shrink-0" />
                        ) : (
                            <IconCalendar className="size-2.5 shrink-0" />
                        )}
                        {dueMeta.label}
                    </span>
                ) : (
                    <span />
                )}

                {task.assignee?.name && (
                    <div
                        title={task.assignee.name}
                        className="flex size-6 shrink-0 items-center justify-center rounded-xl border border-white bg-[#e0e8ff] text-[10px] font-bold leading-3.75 text-slate-900"
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
