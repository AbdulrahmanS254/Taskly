import type { IconProps } from './types';

export const IconChevronLeft = ({ className = 'size-8', size, ...props }: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 5 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <path d="M3.5 7L0 3.5L3.5 0L4.31667 0.816667L1.63333 3.5L4.31667 6.18333L3.5 7Z" fill="#434654"/>
        </svg>
    );
};
