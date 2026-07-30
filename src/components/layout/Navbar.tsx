import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
    getCurrentUser,
    logoutUser,
} from '../../features/auth/services/authService';
import type { CurrentUser } from '../../features/auth/services/authService';
import { clearAllAuthData } from '../../utils/authHelpers';
import { IconMenu, IconLogout } from '../ui/icons';
import { getInitials } from '../../utils/helpers';

interface NavbarProps {
    onMenuClick: () => void;
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
                    <IconMenu />
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
                            <IconLogout className="size-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
