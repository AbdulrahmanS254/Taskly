import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { getCurrentUser } from '../../features/auth/services/authService';
import { clearAllAuthData } from '../../utils/authHelpers';

/**
 * ProtectedRoute: Handles async authentication verification
 * - Prevents render-phase state updates by using a single state machine
 * - Uses conditional rendering instead of throwing redirects during render
 * - Navigation happens in effects, not during render
 */
export default function ProtectedRoute() {
    const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        const verifyAuth = async () => {
            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            if (!token) {
                setAuthState('unauthenticated');
                return;
            }

            try {
                await getCurrentUser();
                setAuthState('authenticated');
            } catch {
                clearAllAuthData();
                setAuthState('unauthenticated');
            }
        };

        verifyAuth();
    }, []);

    // Show loading state while verifying
    if (authState === 'loading') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="text-sm font-medium text-slate-600 animate-pulse">
                    Verifying authentication...
                </div>
            </div>
        );
    }

    // Redirect unauthenticated users to login (happens after render phase)
    if (authState === 'unauthenticated') {
        return <Navigate to="/login" replace />;
    }

    // Only render protected content for authenticated users
    return <Outlet />;
}
