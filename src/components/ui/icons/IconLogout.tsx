import type { IconProps } from './types';

export const IconLogout = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 4H4.5A1.5 1.5 0 003 5.5v9A1.5 1.5 0 004.5 16H7"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 13.5L17 10l-4-3.5M17 10H7"
            />
        </svg>
    );
};
