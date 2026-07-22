// import { createBrowserRouter, Navigate } from 'react-router';
// import LoginPage from '../features/auth/pages/LoginPage';
// import SignUpPage from '../features/auth/pages/SignUpPage';
// import DashboardLayout from '../components/layout/DashboardLayout';
// import GuestRoute from '../components/layout/GuestRoute';
// import ProtectedRoute from './guards/ProtectedRoute.tsx';
// import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
// import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
// import RootRedirect from './guards/RootRedirect.tsx';
// import AddProjectPage from '../features/projects/pages/AddProjectPage.tsx';

// export const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <RootRedirect />,
//     },
//     {
//         element: <GuestRoute />,
//         children: [
//             {
//                 path: '/login',
//                 element: <LoginPage />,
//             },
//             {
//                 path: '/sign-up',
//                 element: <SignUpPage />,
//             },
//             {
//                 path: '/forgot-password',
//                 element: <ForgotPasswordPage />,
//             },
//         ],
//     },
//     // public path
//     {
//         path: '/reset-password',
//         element: <ResetPasswordPage />,
//     },
//     {
//         element: <ProtectedRoute />,
//         children: [
//             {
//                 element: <DashboardLayout />,
//                 children: [
//                     {
//                         path: '/project',
//                         element: <Navigate to="/projects" replace />,
//                     },
//                     {
//                         path: '/project/add',
//                         element: <AddProjectPage />,
//                     },
//                     {
//                         path: '/epics',
//                         element: <div>Project Epics Content</div>,
//                     },
//                     {
//                         path: '/tasks',
//                         element: <div>Project Tasks Content</div>,
//                     },
//                     {
//                         path: '/members',
//                         element: <div>Project Members Content</div>,
//                     },
//                     {
//                         path: '/details',
//                         element: <div>Project Details Content</div>,
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         path: '*',
//         element: <Navigate to="/login" replace />,
//     }
// ]);

import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import GuestRoute from '../components/layout/GuestRoute';
import ProtectedRoute from './guards/ProtectedRoute';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import RootRedirect from './guards/RootRedirect';

export const router = createBrowserRouter([
    // 1. Root Handler
    {
        path: '/',
        element: <RootRedirect />,
    },

    // 2. Standalone Public Route
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },

    // 3. Guest Routes
    {
        element: <GuestRoute />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'sign-up',
                element: <SignUpPage />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
            },
        ],
    },

    // 4. Protected Routes
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: 'project',
                        element: <Navigate to="/projects" replace />,
                    },
                    {
                        path: 'projects',
                        element: <div>Projects Page Content</div>,
                    },
                    {
                        path: 'epics',
                        element: <div>Project Epics Content</div>,
                    },
                    {
                        path: 'tasks',
                        element: <div>Project Tasks Content</div>,
                    },
                    {
                        path: 'members',
                        element: <div>Project Members Content</div>,
                    },
                    {
                        path: 'details',
                        element: <div>Project Details Content</div>,
                    },
                ],
            },
        ],
    },

    // 5. Fallback Catch-all
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
