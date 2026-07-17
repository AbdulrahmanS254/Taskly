import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DashboardLayout from '../components/layout/DashboardLayout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignUpPage />,
    },
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
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
