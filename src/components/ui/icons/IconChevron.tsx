import type { IconProps } from './types';

interface IconChevronProps extends IconProps {
    collapsed?: boolean;
}

export const IconChevron = ({ className = 'size-4.5 shrink-0', collapsed = false, size, ...props }: IconChevronProps) => {
    return (
        <svg
            className={`${className} transition-transform ${collapsed ? 'rotate-180' : ''}`}
            style={size ? { width: size, height: size } : undefined}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.5 5l-5 5 5 5"
            />
        </svg>
    );
};
