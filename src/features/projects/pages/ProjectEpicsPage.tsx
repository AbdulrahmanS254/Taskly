import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getProjectEpics, type Epic } from '../services/epicService';
import { getProjectById } from '../services/projectService';
import { clearAllAuthData } from '../../../utils/authHelpers';
import { getInitials } from '../../../utils/helpers';
import { Pagination } from '../../../components/ui/Pagination';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import EpicDetailsModal from '../components/EpicDetailsModal';
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

const PAGE_SIZE = 6;

type FetchMode = 'replace' | 'append';

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
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEpicId, setSelectedEpicId] = useState<
        string | null
    >(null);

    // Guards against duplicate in-flight requests (e.g. fast mobile scrolling).
    const isFetchingRef = useRef(false);

    const hasMore = epics.length < totalCount;

    const loadEpics = useCallback(
        async (targetPage: number, mode: FetchMode) => {
            if (!projectId) {
                setError('Project ID is missing from the URL.');
                setLoading(false);
                return;
            }

            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            if (mode === 'replace') setLoading(true);
            else setLoadingMore(true);
            setError(null);

            try {
                const { epics: data, totalCount: count } =
                    await getProjectEpics(
                        projectId,
                        targetPage,
                        PAGE_SIZE
                    );
                setTotalCount(count);
                setCurrentPage(targetPage);
                setEpics((prev) =>
                    mode === 'append' ? [...prev, ...data] : data
                );
            } catch (err: unknown) {
                if (isUnauthorizedError(err)) {
                    clearAllAuthData();
                    navigate('/login');
                    return;
                }
                setError(
                    getErrorMessage(
                        err,
                        'Failed to load project epics'
                    )
                );
            } finally {
                setLoading(false);
                setLoadingMore(false);
                isFetchingRef.current = false;
            }
        },
        [projectId, navigate]
    );

    useEffect(() => {
        loadEpics(1, 'replace');
    }, [loadEpics]);

    useEffect(() => {
        if (!projectId) return;
        getProjectById(projectId)
            .then((project) => setProjectName(project.name))
            .catch(() => setProjectName(null));
    }, [projectId]);

    const handlePageChange = (newPage: number) => {
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        if (
            newPage >= 1 &&
            newPage <= totalPages &&
            newPage !== currentPage
        ) {
            loadEpics(newPage, 'replace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Patch the edited epic in place so the list reflects inline edits without
    // refetching (which would drop pages accumulated by mobile infinite scroll).
    const handleEpicUpdated = useCallback((updatedEpic: Epic) => {
        setEpics((prev) =>
            prev.map((item) =>
                item.id === updatedEpic.id ? updatedEpic : item
            )
        );
    }, []);

    const handleLoadMore = useCallback(() => {
        loadEpics(currentPage + 1, 'append');
    }, [currentPage, loadEpics]);

    const { isMobile, observerTarget } = useInfiniteScroll(
        loading,
        loadingMore,
        hasMore,
        handleLoadMore
    );

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
                    <div className="bg-[#ffdad6] rounded-xl size-16 flex items-center justify-center mb-6">
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
                        onClick={() =>
                            loadEpics(currentPage, 'replace')
                        }
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
                        {epics.map((epic) => (
                            <EpicCard
                                key={epic.id}
                                epic={epic}
                                onSelect={() =>
                                    setSelectedEpicId(epic.id)
                                }
                            />
                        ))}
                    </div>

                    {/* Desktop: server-side page navigation */}
                    <div className="hidden md:block">
                        <Pagination
                            currentPage={currentPage}
                            totalCount={totalCount}
                            pageSize={PAGE_SIZE}
                            itemName="epic"
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* Mobile: infinite scroll */}
                    {isMobile && (
                        <div
                            ref={observerTarget}
                            className="md:hidden flex justify-center py-4"
                        >
                            {loadingMore && (
                                <span className="text-xs font-medium text-slate-500 animate-pulse">
                                    Loading more epics...
                                </span>
                            )}
                        </div>
                    )}

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

            {/* Epic details modal */}
            <EpicDetailsModal
                isOpen={selectedEpicId !== null}
                onClose={() => setSelectedEpicId(null)}
                projectId={projectId ?? ''}
                epicId={selectedEpicId}
                onEpicUpdated={handleEpicUpdated}
            />
        </div>
    );
}

function EpicCard({
    epic,
    onSelect,
}: {
    epic: Epic;
    onSelect: () => void;
}) {
    const hasDeadline = Boolean(epic.deadline);

    return (
        <div
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect();
                }
            }}
            className="bg-white border-l-4 border-l-[#004e32] rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] pl-5 pr-4 py-4 flex flex-col justify-between gap-6 cursor-pointer hover:shadow-[0px_4px_12px_0px_rgba(4,27,60,0.08)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="flex items-start justify-between">
                <span className="bg-success text-[#005235] text-[10px] font-bold tracking-[0.5px] px-2.5 py-1 rounded-sm">
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

                {epic.assignee?.name ? (
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
    const bar = 'bg-[#e8edff] rounded-sm';

    return (
        <div className="bg-white rounded-lg shadow-[0px_24px_24px_-12px_rgba(4,27,60,0.04)] p-4 flex flex-col gap-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div
                    className={`h-5 w-20 opacity-40 rounded ${bar}`}
                />
                <div className={`size-8 rounded-xl ${bar}`} />
            </div>
            <div className={`h-6 w-full ${bar}`} />
            <div className="flex items-center gap-3 pt-4">
                <div
                    className={`size-8 rounded-xl shrink-0 ${bar}`}
                />
                <div className={`h-4 w-32 ${bar}`} />
            </div>
            <div className="flex flex-col gap-2 pt-2">
                <div className={`h-1.5 w-full ${bar}`} />
                <div className="flex items-center justify-between">
                    <div className={`h-3 w-12 ${bar}`} />
                    <div className={`h-3 w-12 ${bar}`} />
                </div>
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
            <div className="relative mb-8">
                <div className="absolute inset-4 bg-[#e0e8ff] rounded-full blur-2xl opacity-50" />
                <div className="relative bg-white shadow-[0px_25px_50px_-12px_rgba(0,61,155,0.1)] rounded-4xl size-40 md:size-56 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-primary-container/20 rounded-lg size-14 md:size-16 flex items-center justify-center">
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
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                No epics found for this project
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
