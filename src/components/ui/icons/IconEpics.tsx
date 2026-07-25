import type { IconProps } from './types';

export const IconEpics = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <path d="M10 3l7 4-7 4-7-4 7-4z" />
            <path d="M3 11l7 4 7-4" />
        </svg>
    );
};
