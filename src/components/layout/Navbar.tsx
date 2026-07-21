import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
    getCurrentUser,
    logoutUser,
} from '../../features/auth/services/authService';
import type { CurrentUser } from '../../features/auth/services/authService';
import { clearAllAuthData } from '../../utils/authHelpers';

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
    const navigate = useNavigate();
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
    }, []);

    const handleLogout = async () => {
        setErrorMessage(null);
        try {
            await logoutUser();

            clearAllAuthData();

            navigate('/login');
        } catch (error: any) {
            setErrorMessage(
                error.message || 'Logout failed, please try again.'
            );
        }
    };

    const name = user?.user_metadata?.name;
    const jobTitle = user?.user_metadata?.job_title;
    const initials = getInitials(name);

    return (
        <header className="bg-background border-b border-black/10 flex items-center justify-between px-4 md:px-6 py-3 w-full relative">
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

            <div
                className="flex items-center gap-4 relative"
                ref={dropdownRef}
            >
                {errorMessage && (
                    <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">
                        {errorMessage}
                    </span>
                )}

                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-slate-900 text-sm font-semibold">
                        {name}
                    </span>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                        {jobTitle}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="bg-primary-container flex items-center justify-center rounded-lg shadow-sm size-10 shrink-0 cursor-pointer hover:opacity-90 transition"
                >
                    <span className="text-white text-base font-bold">
                        {initials || 'U'}
                    </span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                        >
                            <svg
                                className="size-4"
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
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
