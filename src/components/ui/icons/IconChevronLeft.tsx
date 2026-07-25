import type { IconProps } from './types';

export const IconChevronLeft = ({ className = 'size-8', size, ...props }: IconProps) => {
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
                d="M7.5 5l-5 5 5 5"
            />
        </svg>
    );
};
