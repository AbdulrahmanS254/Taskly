import type { IconProps } from './types';

export const IconMenu = ({ className = 'size-5', size, ...props }: IconProps) => {
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
                d="M2.5 5h15M2.5 10h15M2.5 15h15"
            />
        </svg>
    );
};
