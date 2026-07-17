import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../features/auth/services/authService';
import type { CurrentUser } from '../../features/auth/services/authService';

interface NavbarProps {
    onMenuClick: () => void;
}

function getInitials(name?: string) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1)
        return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const [user, setUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null));
    }, []);

    const name = user?.user_metadata?.name;
    const jobTitle = user?.user_metadata?.job_title;
    const initials = getInitials(name);

    return (
        <header className="bg-background border-b border-black/10 flex items-center justify-between px-4 md:px-6 py-3 w-full">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center p-2 rounded text-slate-900 cursor-pointer"
                >
                    <svg
                        className="size-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path
                            strokeLinecap="round"
                            d="M2.5 5h15M2.5 10h15M2.5 15h15"
                        />
                    </svg>
                </button>
                <span className="md:hidden font-bold text-slate-900 text-lg tracking-tight">
                    TASKLY
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-slate-900 text-sm font-semibold">
                        {name}
                    </span>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                        {jobTitle}
                    </span>
                </div>
                <div className="bg-primary-container flex items-center justify-center rounded-lg shadow-sm size-10 shrink-0">
                    <span className="text-white text-base font-bold">
                        {initials}
                    </span>
                </div>
            </div>
        </header>
    );
}
