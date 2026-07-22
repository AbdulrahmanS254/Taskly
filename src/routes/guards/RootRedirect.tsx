import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function RootRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;

        if (hash && hash.includes('type=recovery')) {
            navigate(`/reset-password${hash}`, { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return null;
}