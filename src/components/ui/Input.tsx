import React, { forwardRef, useId, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, helperText, isPassword = false, className = '', id, type, ...props },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const [visible, setVisible] = useState(false);

        const resolvedType = isPassword ? (visible ? 'text' : 'password') : type;

        return (
            <div className="w-full text-left">
                <label
                    htmlFor={inputId}
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                >
                    {label}
                </label>

                <div className="relative">
                    <input
                        id={inputId}
                        ref={ref}
                        type={resolvedType}
                        className={`w-full px-4 py-3 rounded bg-surface-highest border-0 text-slate-900 placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-primary transition duration-150 ease-in-out ${
                            isPassword ? 'pr-11' : ''
                        } ${
                            error
                                ? 'ring-2 ring-error focus:ring-error'
                                : ''
                        } ${className}`}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setVisible((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted cursor-pointer"
                            tabIndex={-1}
                        >
                            {visible ? (
                                <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c5 0 9 4 10 7-.32.99-1.06 2.12-2.11 3.14M6.53 6.53C4.6 7.8 3.14 9.63 2 12c1 3 5 7 10 7 1.28 0 2.49-.24 3.6-.68" />
                                </svg>
                            ) : (
                                <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {helperText && !error && (
                    <p className="mt-1 text-xs text-slate-300">
                        {helperText}
                    </p>
                )}

                {error && (
                    <p className="mt-1 text-xs text-error font-medium">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';