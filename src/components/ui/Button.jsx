"use client";

import { forwardRef } from "react";

const variants = {
    primary:
        "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg",
    accent:
        "bg-accent text-bg-deep hover:bg-accent-dark shadow-md hover:shadow-lg",
    outline:
        "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-surface",
    danger: "bg-danger text-white hover:bg-danger-light",
    success: "bg-success text-white hover:opacity-90",
};

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

const Button = forwardRef(function Button(
    {
        children,
        variant = "primary",
        size = "md",
        className = "",
        disabled = false,
        loading = false,
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200 ease-out
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
});

export default Button;
