import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getProjectEpics, type Epic } from '../services/epicService';
import { getProjectById } from '../services/projectService';
import { clearAllAuthData } from '../../../utils/authHelpers';
import { getInitials } from '../../../utils/helpers';
import { Pagination } from '../../../components/ui/Pagination';
import {
    IconPlus,
    IconAlert,
    IconChevronRight,
    IconCalendar,
    IconEpics,
    IconTasks,
    IconMembers,
    IconDetails,
} from '../../../components/ui/icons';

function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message || fallback;
    return fallback;
}

function isUnauthorizedError(err: unknown): boolean {
    const message = err instanceof Error ? err.message : '';
    return (
        message.includes('401') || message.includes('Unauthorized')
    );
}

// Figma shows 6 epics per page ("Showing 6 of 24 epics"). The listing
// endpoint returns the full set for the project, so pagination here is
// applied client-side purely to drive the UI — no server paging yet.
const PAGE_SIZE = 6;

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export default function ProjectEpicsPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [projectName, setProjectName] = useState<string | null>(
        null
    );
    const [epics, setEpics] = useState<Epic[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalCount = epics.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const visibleEpics = epics.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const fetchEpics = useCallback(async () => {
        if (!projectId) {
            setError('Project ID is missing from the URL.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getProjectEpics(projectId);
            setEpics(data);
            setPage(1);
        } catch (err: unknown) {
            if (isUnauthorizedError(err)) {
                clearAllAuthData();
                navigate('/login');
                return;
            }
            setError(
                getErrorMessage(err, 'Failed to load project epics')
            );
        } finally {
            setLoading(false);
        }
    }, [projectId, navigate]);

    useEffect(() => {
        fetchEpics();
    }, [fetchEpics]);

    useEffect(() => {
        if (!projectId) return;
        getProjectById(projectId)
            .then((project) => setProjectName(project.name))
            .catch(() => setProjectName(null));
    }, [projectId]);

    const handlePageChange = (newPage: number) => {
        if (
            newPage >= 1 &&
            newPage <= totalPages &&
            newPage !== page
        ) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-[1.2px] text-slate-500/60">
                        <span>Projects</span>
                        <IconChevronRight />
                        <span>{projectName || 'Project'}</span>
                        <IconChevronRight />
                        <span className="text-primary">Epics</span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                            Project Epics
                        </h1>
                        <p className="text-slate-500 text-base">
                            Track high-level milestones for{' '}
                            {projectName || 'this project'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() =>
                        navigate(`/project/${projectId}/epics/new`)
                    }
                    disabled={loading}
                    className="hidden md:flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-medium text-base px-6 py-3 rounded-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                    <IconPlus className="size-4" />
                    Create New Epic
                </button>
            </div>

            {/* Error state */}
            {error && (
                <div className="flex flex-col items-center justify-center min-h-100 text-center">
                    <div className="bg-error/10 rounded-xl size-16 flex items-center justify-center mb-6">
                        <IconAlert className="size-8 text-error" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                        Something went wrong
                    </h3>
                    <p className="text-slate-500 text-base max-w-[320px] mb-8">
                        We're having trouble retrieving your project
                        epics right now. Please try again in a moment.
                    </p>
                    <button
                        onClick={() => fetchEpics()}
                        className="bg-primary text-white font-semibold text-base px-6 py-2.5 rounded-sm shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition cursor-pointer"
                    >
                        Retry Connection
                    </button>
                </div>
            )}

            {/* Loading state */}
            {!error && loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <EpicCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!error && !loading && totalCount === 0 && (
                <EmptyEpicsState
                    onCreate={() =>
                        navigate(`/project/${projectId}/epics/new`)
                    }
                />
            )}

            {/* Success state */}
            {!error && !loading && totalCount > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {visibleEpics.map((epic) => (
                            <EpicCard key={epic.id} epic={epic} />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        itemName="epic"
                        onPageChange={handlePageChange}
                    />

                    {/* Mobile floating action button */}
                    <button
                        onClick={() =>
                            navigate(
                                `/project/${projectId}/epics/new`
                            )
                        }
                        className="md:hidden bg-primary border-2 border-surface-low h-13.5 w-13.5 rounded-xl flex items-center justify-center fixed right-6 bottom-10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.15)] cursor-pointer"
                    >
                        <IconPlus className="size-6 text-white" />
                    </button>
                </>
            )}
        </div>
    );
}

function EpicCard({ epic }: { epic: Epic }) {
    const hasDeadline = Boolean(epic.deadline);

    return (
        <div className="bg-white border-l-4 border-l-[#004e32] rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] pl-5 pr-4 py-4 flex flex-col justify-between gap-6">
            <div className="flex items-start justify-between">
                <span className="bg-success text-[#005235] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-sm">
                    {epic.epic_id}
                </span>
                <svg
                    className="w-1 h-4 text-slate-300 shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 4 16"
                >
                    <circle cx="2" cy="2" r="2" />
                    <circle cx="2" cy="8" r="2" />
                    <circle cx="2" cy="14" r="2" />
                </svg>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                    {epic.title}
                </h3>

                {epic.assignee ? (
                    <div className="flex items-center gap-3">
                        <div className="bg-[#65dca4] text-[#002113] flex items-center justify-center rounded-xl size-10 font-bold text-sm shrink-0">
                            {getInitials(epic.assignee.name)}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">
                                Assignee
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                {epic.assignee.name}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="bg-surface-highest text-slate-muted flex items-center justify-center rounded-xl size-10 font-bold text-sm shrink-0">
                            --
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">
                                Assignee
                            </p>
                            <p className="text-sm font-semibold text-slate-400">
                                Unassigned
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-surface-low pt-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500/80">
                    <IconMembers className="size-3 shrink-0" />
                    <span>
                        Created by:{' '}
                        <span className="font-semibold text-slate-900">
                            {epic.created_by?.name || 'Unknown'}
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500/80">
                    <IconCalendar className="size-3.5 shrink-0" />
                    <span>
                        {hasDeadline
                            ? `Deadline: ${formatDate(epic.deadline as string)}`
                            : `Created: ${formatDate(epic.created_at)}`}
                    </span>
                </div>
            </div>
        </div>
    );
}

function EpicCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] pl-5 pr-4 py-4 flex flex-col gap-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-5 w-20 bg-surface-highest rounded-sm" />
                <div className="h-8 w-8 bg-surface-highest rounded" />
            </div>
            <div className="space-y-6">
                <div className="h-6 w-full bg-surface-highest rounded" />
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-surface-highest rounded-xl shrink-0" />
                    <div className="h-4 w-32 bg-surface-highest rounded" />
                </div>
            </div>
            <div className="border-t border-surface-low pt-4 flex items-center justify-between">
                <div className="h-3 w-24 bg-surface-highest rounded" />
                <div className="h-3 w-24 bg-surface-highest rounded" />
            </div>
        </div>
    );
}

const emptyStateTips = [
    {
        icon: IconEpics,
        title: 'High-Level Goals',
        description:
            'Define the broad objectives that span across multiple cycles.',
    },
    {
        icon: IconTasks,
        title: 'Hierarchy Design',
        description:
            'Link individual tasks to parent epics for a consolidated view.',
    },
    {
        icon: IconDetails,
        title: 'Track Velocity',
        description:
            'Visualize percentage completion at a macro project level.',
    },
];

function EmptyEpicsState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 md:py-20">
            <div className="bg-[#f1f3ff] rounded-2xl size-40 md:size-56 flex items-center justify-center mb-8">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white shadow-[0px_25px_50px_-12px_rgba(0,61,155,0.1)] rounded-lg size-14 md:size-16 flex items-center justify-center">
                        <IconEpics className="size-6 text-primary" />
                    </div>
                    <div className="bg-surface-highest rounded-lg size-14 md:size-16 flex items-center justify-center">
                        <IconTasks className="size-6 text-primary" />
                    </div>
                    <div className="bg-surface-highest rounded-lg size-14 md:size-16 flex items-center justify-center">
                        <IconMembers className="size-6 text-primary" />
                    </div>
                    <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-lg size-14 md:size-16 flex items-center justify-center">
                        <IconDetails className="size-6 text-primary" />
                    </div>
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                No epics in this project yet.
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-md mb-8">
                Break down your large project into manageable epics to
                track progress better and maintain architectural
                clarity.
            </p>
            <button
                onClick={onCreate}
                className="flex items-center gap-3 bg-linear-to-br from-primary to-primary-container text-white font-bold text-base md:text-lg px-8 py-4 rounded-sm shadow-[0px_25px_50px_-12px_rgba(0,61,155,0.3)] hover:opacity-90 transition cursor-pointer"
            >
                <IconPlus className="size-5" />
                Create First Epic
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl w-full text-left">
                {emptyStateTips.map((tip) => (
                    <div
                        key={tip.title}
                        className="bg-surface-low rounded-lg p-5"
                    >
                        <div className="bg-white rounded shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] size-10 flex items-center justify-center mb-4">
                            <tip.icon className="size-5 text-primary" />
                        </div>
                        <h4 className="text-base font-semibold text-slate-900 mb-1.5">
                            {tip.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-[1.6]">
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
