import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import GuestRoute from '../components/layout/GuestRoute';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        element: <GuestRoute />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/sign-up',
                element: <SignUpPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: '/project',
                        element: <Navigate to="/projects" replace />,
                    },
                    {
                        path: '/projects',
                        element: <div>Projects Page Content</div>,
                    },
                    {
                        path: '/epics',
                        element: <div>Project Epics Content</div>,
                    },
                    {
                        path: '/tasks',
                        element: <div>Project Tasks Content</div>,
                    },
                    {
                        path: '/members',
                        element: <div>Project Members Content</div>,
                    },
                    {
                        path: '/details',
                        element: <div>Project Details Content</div>,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
