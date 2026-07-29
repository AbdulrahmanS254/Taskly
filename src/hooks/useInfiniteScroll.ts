import { useEffect, useState, useRef, type RefObject } from 'react';

export function useInfiniteScroll(
    loading: boolean,
    loadingMore: boolean,
    hasMore: boolean,
    onLoadMore: () => void
): {
    isMobile: boolean;
    observerTarget: RefObject<HTMLDivElement | null>;
} {
    const [isMobile, setIsMobile] = useState(false);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const checkMobile = () =>
            setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () =>
            window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !loading &&
                    !loadingMore &&
                    hasMore
                ) {
                    onLoadMore();
                }
            },
            { threshold: 0.5 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [isMobile, loading, loadingMore, hasMore, onLoadMore]);

    return { isMobile, observerTarget };
}
