import React, { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, helperText, className = '', id, ...props },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className="w-full text-left">
                <label
                    htmlFor={inputId}
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                    {label}
                </label>

                <input
                    id={inputId}
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-lg bg-[#E2ECFF]/50 border-0 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out ${
                        error
                            ? 'ring-2 ring-red-500 focus:ring-red-500'
                            : ''
                    } ${className}`}
                    {...props}
                />

                {helperText && !error && (
                    <p className="mt-1 text-xs text-slate-400">
                        {helperText}
                    </p>
                )}

                {error && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
