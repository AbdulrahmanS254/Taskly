import { NavLink, useNavigate } from 'react-router';

interface SidebarProps {
    open: boolean;
    collapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
}

function IconProjects() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path d="M3 6.5A2.5 2.5 0 015.5 4h9A2.5 2.5 0 0117 6.5v7a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 13.5v-7z" />
            <path d="M3 8h14" />
        </svg>
    );
}

function IconEpics() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path d="M10 3l7 4-7 4-7-4 7-4z" />
            <path d="M3 11l7 4 7-4" />
        </svg>
    );
}

function IconTasks() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path strokeLinecap="round" d="M4 6h12M4 10h12M4 14h8" />
        </svg>
    );
}

function IconMembers() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="7" cy="7" r="2.5" />
            <path d="M2.5 16c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
            <circle cx="14.5" cy="7.5" r="2" />
            <path d="M12.5 12.2c1.9.3 3.5 1.6 3.5 3.8" />
        </svg>
    );
}

function IconDetails() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="10" cy="10" r="7" />
            <path strokeLinecap="round" d="M10 9v4.5M10 6.5v.01" />
        </svg>
    );
}

function IconLogout() {
    return (
        <svg
            className="size-4.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 4H4.5A1.5 1.5 0 003 5.5v9A1.5 1.5 0 004.5 16H7"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 13.5L17 10l-4-3.5M17 10H7"
            />
        </svg>
    );
}

function IconChevron({ collapsed }: { collapsed: boolean }) {
    return (
        <svg
            className={`size-4.5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.5 5l-5 5 5 5"
            />
        </svg>
    );
}

const navItems = [
    { label: 'Projects', to: '/projects', icon: IconProjects },
    { label: 'Project Epics', to: '/epics', icon: IconEpics },
    { label: 'Project Tasks', to: '/tasks', icon: IconTasks },
    { label: 'Project Members', to: '/members', icon: IconMembers },
    { label: 'Project Details', to: '/details', icon: IconDetails },
];

export default function Sidebar({
    open,
    collapsed,
    onClose,
    onToggleCollapse,
}: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
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
                            <svg
                                viewBox="0 0 18 20"
                                className="w-full h-full p-0.5 text-white"
                                fill="currentColor"
                            >
                                <path d="M9 20L0 15V5L9 0L18 5V15L9 20ZM6.1 7.25C6.48333 6.85 6.925 6.54167 7.425 6.325C7.925 6.10833 8.45 6 9 6C9.55 6 10.075 6.10833 10.575 6.325C11.075 6.54167 11.5167 6.85 11.9 7.25L14.9 5.575L9 2.3L3.1 5.575L6.1 7.25ZM8 17.15V13.875C7.1 13.6417 6.375 13.1667 5.825 12.45C5.275 11.7333 5 10.9167 5 10C5 9.81667 5.00833 9.64583 5.025 9.4875C5.04167 9.32917 5.075 9.16667 5.125 9L2 7.25V13.825L8 17.15ZM9 12C9.55 12 10.0208 11.8042 10.4125 11.4125C10.8042 11.0208 11 10.55 11 10C11 9.45 10.8042 8.97917 10.4125 8.5875C10.0208 8.19583 9.55 8 9 8C8.45 8 7.97917 8.19583 7.5875 8.5875C7.19583 8.97917 7 9.45 7 10C7 10.55 7.19583 11.0208 7.5875 11.4125C7.97917 11.8042 8.45 12 9 12ZM10 17.15L16 13.825V7.25L12.875 9C12.925 9.16667 12.9583 9.32917 12.975 9.4875C12.9917 9.64583 13 9.81667 13 10C13 10.9167 12.725 11.7333 12.175 12.45C11.625 13.1667 10.9 13.6417 10 13.875V17.15Z" />
                            </svg>
                        </div>
                        {showLabels && (
                            <span className="font-bold text-slate-900 text-xl tracking-tight">
                                TASKLY
                            </span>
                        )}
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map(({ label, to, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-slate-900'
                                    } ${!showLabels ? 'justify-center' : ''}`
                                }
                            >
                                <Icon />
                                {showLabels && <span>{label}</span>}
                            </NavLink>
                        ))}
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
