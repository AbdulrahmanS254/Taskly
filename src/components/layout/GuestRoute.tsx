import { Navigate, Outlet } from 'react-router';
import { getCookie } from '../../utils/cookies';

/**
 * GuestRoute: Prevents authenticated users from accessing auth pages
 * - Allows password recovery flow (type=recovery hash) to pass through
 * - Redirects authenticated users to dashboard (unless recovery flow)
 * - Pure render-based guard (no state updates in render phase)
 */
export default function GuestRoute() {
    const token = getCookie('token');

    // Allow password recovery flows to pass through regardless of auth state
    const isRecoveryFlow =
        window.location.hash.includes('type=recovery');

    // If user is authenticated and NOT in recovery flow, redirect to dashboard
    if (token && !isRecoveryFlow) {
        return <Navigate to="/projects" replace />;
    }

    return <Outlet />;
}
