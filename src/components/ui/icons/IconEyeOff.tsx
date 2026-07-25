import type { IconProps } from './types';

export const IconEyeOff = ({ className = 'size-4.5', size, ...props }: IconProps) => {
    return (
        <svg
            className={className}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <path d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c5 0 9 4 10 7-.32.99-1.06 2.12-2.11 3.14M6.53 6.53C4.6 7.8 3.14 9.63 2 12c1 3 5 7 10 7 1.28 0 2.49-.24 3.6-.68" />
        </svg>
    );
};
