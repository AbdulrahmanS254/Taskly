import type { IconProps } from './types';

export const IconTasks = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <path strokeLinecap="round" d="M4 6h12M4 10h12M4 14h8" />
        </svg>
    );
};
