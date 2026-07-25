import React, { forwardRef, useId, useState } from 'react';
import { IconEye, IconEyeOff } from './icons';

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
                                <IconEyeOff />
                            ) : (
                                <IconEye />
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