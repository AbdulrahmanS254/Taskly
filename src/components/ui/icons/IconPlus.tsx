import type { IconProps } from './types';

export const IconPlus = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <path strokeLinecap="round" d="M10 4.5v11M4.5 10h11" />
        </svg>
    );
};
