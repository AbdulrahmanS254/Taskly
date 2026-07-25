import type { IconProps } from './types';

export const IconMembers = ({ className = 'size-4.5 shrink-0', size, ...props }: IconProps) => {
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
            <circle cx="7" cy="7" r="2.5" />
            <path d="M2.5 16c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
            <circle cx="14.5" cy="7.5" r="2" />
            <path d="M12.5 12.2c1.9.3 3.5 1.6 3.5 3.8" />
        </svg>
    );
};
