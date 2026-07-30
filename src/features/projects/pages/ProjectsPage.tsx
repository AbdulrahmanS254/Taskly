import { useEffect, useState, useCallback } from 'react'; // 👈 إضافة useCallback هنا
import { useNavigate } from 'react-router';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { Pagination } from '../../../components/ui/Pagination';
import {
    getProjects,
    type Project,
} from '../services/projectService';
import { clearAllAuthData } from '../../../utils/authHelpers';
import {
    IconEdit,
    IconPlus,
    IconAlert,
    IconCalendar,
} from '../../../components/ui/icons';

const LIMIT = 9;

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / LIMIT);

    const fetchProjects = useCallback(
        async (currentPage: number, append = false) => {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            setError(null);

            try {
                const { data, totalCount: total } = await getProjects(
                    currentPage,
                    LIMIT
                );

                setTotalCount(total);
                if (append) {
                    setProjects((prev) => [...prev, ...data]);
                } else {
                    setProjects(data);
                }
            } catch (err: any) {
                if (
                    err?.message?.includes('401') ||
                    err?.message?.includes('Unauthorized')
                ) {
                    clearAllAuthData();
                    navigate('/login');
                    return;
                }
                setError(err?.message || 'Failed to load projects');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [navigate]
    );

    const { isMobile, observerTarget } = useInfiniteScroll(
        loading,
        loadingMore,
        page < totalPages,
        () => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, true);
        }
    );

    useEffect(() => {
        if (!isMobile) {
            fetchProjects(page, false);
        }
    }, [page, isMobile, fetchProjects]);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', {
            month: 'short',
        });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // ---------- Error state ----------
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-150 text-center">
                <div className="bg-error/10 rounded-xl size-16 flex items-center justify-center mb-6">
                    <IconAlert className="size-8 text-error" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Something went wrong
                </h3>
                <p className="text-slate-500 text-base max-w-[320px] mb-8">
                    We're having trouble retrieving your projects
                    right now. Please try again in a moment.
                </p>
                <button
                    onClick={() => fetchProjects(page, false)}
                    className="bg-primary text-white font-semibold text-base px-6 py-2.5 rounded-sm shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition cursor-pointer"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // ---------- Empty state ----------
    if (!loading && totalCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-150 text-center">
                <div className="bg-[#f1f3ff] rounded-lg size-45 md:size-55 flex items-center justify-center mb-8 relative">
                    <div className="bg-[#d7e2ff] rounded-xl size-16 flex items-center justify-center shadow-[0px_20px_25px_-5px_rgba(4,27,60,0.05),0px_8px_10px_-6px_rgba(4,27,60,0.05)]">
                        <IconPlus className="size-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                    No Projects Found
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-md mb-8">
                    You don't have any projects yet. Start by defining
                    your first workspace to begin tracking tasks and
                    epics.
                </p>
                <button
                    onClick={() => navigate('/project/add')}
                    className="flex items-center gap-3 bg-linear-to-br from-primary to-primary-container text-white font-bold text-base md:text-lg px-8 py-4 rounded-sm shadow-[0px_25px_50px_-12px_rgba(0,61,155,0.3)] hover:opacity-90 transition cursor-pointer"
                >
                    <IconPlus className="size-5" />
                    Create New Project
                </button>
            </div>
        );
    }

    // ---------- Loaded / loading (header always visible) ----------
    return (
        <div className="space-y-10">
            {!isMobile ? (
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                            Projects
                        </h1>
                        <p className="text-slate-500 text-base">
                            Manage and curate your projects
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/project/add')}
                        disabled={loading}
                        className="flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-medium text-base px-6 py-3 rounded-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                        <IconPlus className="size-4" />
                        Create New Project
                    </button>
                </div>
            ) : (
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                            Projects
                        </h1>
                        <p className="text-slate-500 text-base">
                            Manage and curate your projects
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: LIMIT }).map((_, i) => (
                        <ProjectSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() =>
                                    navigate(
                                        `/project/${project.id}/epics`
                                    )
                                }
                                className="bg-white rounded-lg p-6 h-55 flex flex-col justify-between shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-md transition cursor-pointer"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-medium text-slate-900 line-clamp-1">
                                            {project.name}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    `/project/${project.id}/edit`
                                                );
                                            }}
                                            className="p-1 text-slate-400 hover:text-primary transition shrink-0 cursor-pointer"
                                            title="Edit Project"
                                        >
                                            <IconEdit />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-[1.4] line-clamp-3">
                                        {project.description ||
                                            'No description'}
                                    </p>
                                </div>
                                <div className="border-t border-surface-low pt-4 flex items-center justify-between">
                                    <span className="text-[11px] font-bold tracking-[-0.5px] uppercase text-slate-400">
                                        Created at
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                        <IconCalendar className="size-4" />
                                        {formatDate(
                                            project.created_at
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isMobile ? (
                            <button
                                onClick={() =>
                                    navigate('/project/add')
                                }
                                className="bg-primary border-2 border-surface-low h-13.5 w-13.5 rounded-xl flex flex-col items-center justify-center hover:border-primary/40 transition cursor-pointer fixed right-6 bottom-10"
                            >
                                <IconPlus className="size-6 text-white" />
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    navigate('/project/add')
                                }
                                className="bg-white border-2 border-dashed border-surface-low h-55 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition cursor-pointer"
                            >
                                <div className="bg-[#f1f3ff] rounded-xl size-12 flex items-center justify-center">
                                    <IconPlus className="size-6 text-primary" />
                                </div>
                                <span className="text-sm font-bold tracking-[1.4px] uppercase text-slate-500">
                                    Add Project
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Infinite Scroll*/}
                    {/* Infinite Scroll trigger area for Mobile */}
                    {isMobile && page < totalPages && (
                        <div
                            ref={observerTarget}
                            className="py-6 flex justify-center"
                        >
                            {loadingMore && <p>Loading...</p>}
                        </div>
                    )}

                    {/* Desktop Pagination */}
                    {!isMobile && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            itemName="project"
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

function ProjectSkeleton() {
    return (
        <div className="bg-white rounded-lg p-6 h-55 flex flex-col justify-between shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] animate-pulse">
            <div className="space-y-4">
                <div className="h-6 w-3/4 bg-surface-highest rounded" />
                <div className="space-y-2">
                    <div className="h-3 w-full bg-surface-highest rounded" />
                    <div className="h-3 w-5/6 bg-surface-highest rounded" />
                </div>
            </div>
            <div className="border-t border-surface-low pt-4">
                <div className="h-4 w-1/3 bg-surface-highest rounded" />
            </div>
        </div>
    );
}
