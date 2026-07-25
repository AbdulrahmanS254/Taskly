import type { IconProps } from './types';

interface IconCheckProps extends IconProps {
    active?: boolean;
}

export const IconCheck = ({ className = 'size-3 shrink-0', active = false, size, ...props }: IconCheckProps) => {
    return (
        <svg
            className={`${className} ${active ? 'text-success' : 'text-slate-300'}`}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 20 20"
            fill="currentColor"
            {...props}
        >
            {active ? (
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            ) : (
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            )}
        </svg>
    );
};
