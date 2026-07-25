import type { IconProps } from './types';

export const IconCalendar = ({ className = 'size-4 shrink-0', size, ...props }: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <rect x="3" y="4" width="14" height="12" rx="2" />
            <path strokeLinecap="round" d="M3 8h14M7 2v4M13 2v4" />
        </svg>
    );
};
