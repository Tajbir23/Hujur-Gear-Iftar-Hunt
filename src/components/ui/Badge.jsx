"use client";

const colorMap = {
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    gray: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export default function Badge({
    children,
    color = "green",
    className = "",
    dot = false,
    ...props
}) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-xs font-medium
        border
        ${colorMap[color] || colorMap.green}
        ${className}
      `}
            {...props}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
            )}
            {children}
        </span>
    );
}
