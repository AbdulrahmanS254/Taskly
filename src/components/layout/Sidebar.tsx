import { useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import {
    IconProjects,
    IconEpics,
    IconTasks,
    IconMembers,
    IconDetails,
    IconLogout,
    IconChevron,
    IconLogo,
} from '../ui/icons';
import { clearAllAuthData } from '../../utils/authHelpers';

interface SidebarProps {
    open: boolean;
    collapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
}


export default function Sidebar({
    open,
    collapsed,
    onClose,
    onToggleCollapse,
}: SidebarProps) {

    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId?: string }>();

    const navItems = useMemo(() => {
        const getProjectScopedPath = (path: string) => {
            return projectId
                ? `/project/${projectId}${path}`
                : '/project';
        };

        const items = [
            { label: 'Projects', to: '/projects', icon: IconProjects },
        ];

        if (projectId) {
            items.push(
                {
                    label: 'Project Epics',
                    to: getProjectScopedPath('/epics'),
                    icon: IconEpics,
                },
                {
                    label: 'Project Tasks',
                    to: getProjectScopedPath('/tasks'),
                    icon: IconTasks,
                },
                {
                    label: 'Project Members',
                    to: getProjectScopedPath('/members'),
                    icon: IconMembers,
                },
                {
                    label: 'Project Details',
                    to: getProjectScopedPath('/details'),
                    icon: IconDetails,
                }
            );
        }

        return items;
    }, [projectId]);

    const handleLogout = () => {
        clearAllAuthData();
        navigate('/login');
    };

    const showLabels = !collapsed || open;

    return (
        <>
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 md:hidden"
                />
            )}

            <aside
                className={`bg-surface-low flex flex-col justify-between h-screen fixed top-0 left-0 z-50 p-4 transition-all duration-200 w-72 ${
                    collapsed ? 'md:w-20' : 'md:w-64'
                } ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 px-2">
                        <div className="bg-primary size-4.5 rounded-sm shrink-0">
                            <IconLogo />
                        </div>
                        {showLabels && (
                            <span className="font-bold text-slate-900 text-xl tracking-tight">
                                TASKLY
                            </span>
                        )}
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map(({ label, to, icon: Icon }) => {
                            return (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                end={to === '/projects'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-white text-primary shadow-sm font-semibold'
                                            : 'text-slate-900 hover:bg-slate-100'
                                    } ${!showLabels ? 'justify-center' : ''}`
                                }
                            >
                                <Icon />
                                {showLabels && <span>{label}</span>}
                            </NavLink>
                        )
                        } )}
                    </nav>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-300/20 pt-6">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className={`hidden md:flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-slate-900 cursor-pointer ${
                            collapsed ? 'justify-center' : ''
                        }`}
                    >
                        <IconChevron collapsed={collapsed} />
                        {!collapsed && <span>Collapse</span>}
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-error cursor-pointer ${
                            !showLabels ? 'justify-center' : ''
                        }`}
                    >
                        <IconLogout />
                        {showLabels && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
