import type { IconProps } from './types';

export const IconClose = ({ className = 'size-3.5 shrink-0', size, ...props }: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            {...props}
        >
            <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
        </svg>
    );
};
