import { Navigate, Outlet, useLocation } from 'react-router';

export default function GuestRoute() {
    // const token =
    //     localStorage.getItem('token') ||
    //     sessionStorage.getItem('token');

    // if (token) {
    //     return <Navigate to={'/projects'} replace />;
    // }

    const location = useLocation();
    const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

    const isRecovery =
        window.location.hash.includes('type=recovery') ||
        location.pathname === '/reset-password';

    if (token && !isRecovery) {
        return <Navigate to="/projects" replace />;
    }

    return <Outlet />;
}
