import { Navigate, Outlet } from 'react-router';

export default function GuestRoute() {
    const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

    if (token) {
        return <Navigate to={'/projects'} replace />;
    }

    return <Outlet />;
}
