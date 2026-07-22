// src/routes/ProtectedRoute.tsx (or src/components/guards/ProtectedRoute.tsx)
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { getCurrentUser } from '../../features/auth/services/authService';
import { clearAllAuthData } from '../../utils/authHelpers';

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<
        boolean | null
    >(null);

    useEffect(() => {
        const token =
            localStorage.getItem('token') ||
            sessionStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        getCurrentUser()
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                clearAllAuthData();
                setIsAuthenticated(false);
            });
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="text-sm font-medium text-slate-600 animate-pulse">
                    Verifying authentication...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
