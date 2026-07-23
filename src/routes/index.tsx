import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import GuestRoute from '../components/layout/GuestRoute';
import ProtectedRoute from './guards/ProtectedRoute.tsx';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import RootRedirect from './guards/RootRedirect.tsx';
import AddProjectPage from '../features/projects/pages/AddProjectPage.tsx';
import ProjectsPage from '../features/projects/pages/ProjectsPage.tsx';

/**
 * Router Configuration:
 * 1. Root (/) - RootRedirect handles auth state check & recovery links
 * 2. Guest Routes (/login, /sign-up, /forgot-password) - GuestRoute guards
 * 3. Public Route (/reset-password) - No guards, preserves hash
 * 4. Protected Routes (/projects, etc.) - ProtectedRoute guards with DashboardLayout
 * 5. Catch-all (*) - Redirects to login
 *
 * Key: Guards are at route level, NOT nested to prevent circular checks
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootRedirect />,
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
            {
                path: '/forgot-password',
                element: <ForgotPasswordPage />,
            },
        ],
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: 'projects',
                        children: [
                            {
                                index: true,
                                element: <ProjectsPage />,
                            },
                            {
                                path: 'add',
                                element: <AddProjectPage />,
                            },
                            {
                                path: ':projectId',
                                children: [
                                    {
                                        index: true,
                                        element: (
                                            <Navigate
                                                to="epics"
                                                replace
                                            />
                                        ),
                                    },
                                    {
                                        path: 'epics',
                                        element: <div />,
                                    },
                                    {
                                        path: 'tasks',
                                        element: <div />,
                                    },
                                    {
                                        path: 'members',
                                        element: <div />,
                                    },
                                    {
                                        path: 'edit',
                                        element: <div />,
                                    },
                                ],
                            },
                        ],
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
