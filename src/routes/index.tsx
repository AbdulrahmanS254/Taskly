import { createBrowserRouter } from 'react-router';
import App from '../App';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
    },
    {
        path: '/signup',
        element: <div>coco wawa</div>,
    },
]);
