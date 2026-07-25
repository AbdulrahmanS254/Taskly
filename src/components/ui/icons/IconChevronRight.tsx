import type { IconProps } from './types';

export const IconChevronRight = ({ className = 'size-2.5 shrink-0', size, ...props }: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 1l4 3-4 3"
            />
        </svg>
    );
};
