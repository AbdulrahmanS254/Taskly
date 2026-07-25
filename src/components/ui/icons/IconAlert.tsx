import type { IconProps } from './types';

export const IconAlert = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <circle cx="10" cy="10" r="7.5" />
            <path strokeLinecap="round" d="M10 6.5v4M10 13v.01" />
        </svg>
    );
};
