"use client";

export default function Card({
    children,
    className = "",
    glass = false,
    hover = false,
    glow = false,
    ...props
}) {
    return (
        <div
            className={`
        rounded-xl p-5
        ${glass ? "glass" : "bg-bg-card border border-border"}
        ${hover ? "hover:bg-bg-card-hover transition-colors duration-200" : ""}
        ${glow ? "glow-primary glow-border" : ""}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}
