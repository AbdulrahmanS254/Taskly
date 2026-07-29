import type { IconProps } from './types';

export const IconChevronRight = ({
    className = 'size-2.5 shrink-0',
    size,
    ...props
}: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 5 7"
            fill="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <path d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5Z" fill="#434654"/>
        </svg>
    );
};
