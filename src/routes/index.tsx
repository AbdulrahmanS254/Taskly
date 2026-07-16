import { createBrowserRouter } from 'react-router';
import App from '../App';
import SignUpPage from '../features/auth/pages/SignUpPage';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
    },
    {
        path: '/project',
        element: <div>main page</div>,
    },
    {
        path: '/sign-up',
        Component: SignUpPage,
    },
]);
