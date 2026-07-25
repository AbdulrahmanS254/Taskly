import type { IconProps } from './types';

export const IconProjects = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <path d="M3 6.5A2.5 2.5 0 015.5 4h9A2.5 2.5 0 0117 6.5v7a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 13.5v-7z" />
            <path d="M3 8h14" />
        </svg>
    );
};
