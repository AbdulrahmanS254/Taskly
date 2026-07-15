import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Router
import { RouterProvider } from 'react-router/dom';
import { router } from './routes';

import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error(
        'Failed to find the root element. Check your index.html'
    );
}

createRoot(rootElement).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
