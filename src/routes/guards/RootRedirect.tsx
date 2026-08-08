import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCookie } from '../../utils/cookies';

export default function RootRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;

        if (hash && hash.includes('type=recovery')) {
            navigate(`/reset-password${hash}`, { replace: true });
        } else {
            // Determine redirect based on auth state without triggering guards
            const token = getCookie('token');
            navigate(token ? '/projects' : '/login', { replace: true });
        }
    }, [navigate]);

    return null;
}