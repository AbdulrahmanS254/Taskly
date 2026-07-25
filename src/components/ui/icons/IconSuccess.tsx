import type { IconProps } from './types';

export const IconSuccess = ({ className = 'size-5 shrink-0', size, ...props }: IconProps) => {
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
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 10l2 2 4-4.5"
            />
        </svg>
    );
};
