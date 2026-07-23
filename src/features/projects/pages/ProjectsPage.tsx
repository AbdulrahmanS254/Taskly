import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProjects, type Project } from '../services/projectService';
import { clearAllAuthData } from '../../../utils/authHelpers';

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err: any) {
            if (err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
                clearAllAuthData();
                navigate('/login');
                return;
            }
            setError(err?.message || 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // ---------- Error state ----------
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-150 text-center">
                <div className="bg-error/10 rounded-xl size-16 flex items-center justify-center mb-6">
                    {/* Placeholder for AlertTriangle icon */}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Something went wrong
                </h3>
                <p className="text-slate-500 text-base max-w-[320px] mb-8">
                    We're having trouble retrieving your projects right now. Please try again in a moment.
                </p>
                <button
                    onClick={fetchProjects}
                    className="bg-primary text-white font-semibold text-base px-6 py-2.5 rounded-sm shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition cursor-pointer"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // ---------- Empty state ----------
    if (!loading && projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-150 text-center">
                <div className="bg-[#f1f3ff] rounded-lg size-45 md:size-55 flex items-center justify-center mb-8 relative">
                    <div className="bg-[#d7e2ff] rounded-xl size-16 flex items-center justify-center shadow-[0px_20px_25px_-5px_rgba(4,27,60,0.05),0px_8px_10px_-6px_rgba(4,27,60,0.05)]">
                        {/* Placeholder for FolderPlus icon */}
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                    No Projects
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-md mb-8">
                    You don't have any projects yet. Start by defining your first workspace to begin tracking tasks and epics.
                </p>
                <button
                    onClick={() => navigate('/projects/add')}
                    className="flex items-center gap-3 bg-linear-to-br from-primary to-primary-container text-white font-bold text-base md:text-lg px-8 py-4 rounded-sm shadow-[0px_25px_50px_-12px_rgba(0,61,155,0.3)] hover:opacity-90 transition cursor-pointer"
                >
                    {/* Placeholder for Plus icon */}
                    Create New Project
                </button>
            </div>
        );
    }

    // ---------- Loaded / loading (header always visible) ----------
    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 text-base">Manage and curate your projects</p>
                </div>
                <button
                    onClick={() => navigate('/project/add')}
                    disabled={loading}
                    className="flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-white font-medium text-base px-6 py-3 rounded-sm shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                    {/* Placeholder for Plus icon */}
                    Create New Project
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProjectSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/projects/${project.id}`)}
                                className="bg-white rounded-lg p-6 h-55 flex flex-col justify-between shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-md transition cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2 line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-[1.4] line-clamp-3">
                                        {project.description || 'No description'}
                                    </p>
                                </div>
                                <div className="border-t border-surface-low pt-4 flex items-center justify-between">
                                    <span className="text-[11px] font-bold tracking-[-0.5px] uppercase text-slate-400">
                                        Created at
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                        {/* Placeholder for CalendarDays icon */}
                                        {formatDate(project.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => navigate('/projects/add')}
                            className="bg-white border-2 border-dashed border-surface-low h-55 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition cursor-pointer"
                        >
                            <div className="bg-[#f1f3ff] rounded-xl size-12 flex items-center justify-center">
                                {/* Placeholder for Plus icon */}
                            </div>
                            <span className="text-sm font-bold tracking-[1.4px] uppercase text-slate-500">
                                Add Project
                            </span>
                        </button>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between border-t border-surface-low pt-4">
                        <p className="text-xs font-medium text-slate-500">
                            Showing {projects.length} of {projects.length} active project{projects.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled
                                className="size-8 flex items-center justify-center border border-surface-low rounded-sm text-slate-400 disabled:cursor-not-allowed"
                            >
                                {/* Placeholder for ChevronLeft icon */}
                            </button>
                            <button className="size-8 flex items-center justify-center bg-primary border border-surface-low rounded-sm text-white text-xs font-bold">
                                1
                            </button>
                            <button
                                disabled
                                className="size-8 flex items-center justify-center border border-surface-low rounded-sm text-slate-400 disabled:cursor-not-allowed"
                            >
                                {/* Placeholder for ChevronRight icon */}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
    // needs to be moved to a separate component
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