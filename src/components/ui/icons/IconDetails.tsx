import type { IconProps } from './types';

export const IconDetails = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <circle cx="10" cy="10" r="7" />
            <path strokeLinecap="round" d="M10 9v4.5M10 6.5v.01" />
        </svg>
    );
};
