import { createBrowserRouter } from 'react-router';
import App from '../App';

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
        element: <div>signup</div>,
    },
]);
