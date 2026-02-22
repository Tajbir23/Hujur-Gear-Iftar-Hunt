"use client";

const statusConfig = {
    "Food Available": {
        bg: "bg-green-500/15",
        text: "text-green-400",
        border: "border-green-500/30",
        icon: "🍽️",
    },
    "Very Crowded": {
        bg: "bg-yellow-500/15",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: "👥",
    },
    Finished: {
        bg: "bg-red-500/15",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: "❌",
    },
    "AC Available": {
        bg: "bg-blue-500/15",
        text: "text-blue-400",
        border: "border-blue-500/30",
        icon: "❄️",
    },
    "Good Fan Coverage": {
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        icon: "🌀",
    },
    Suffocating: {
        bg: "bg-red-500/15",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: "🥵",
    },
    Parking: {
        bg: "bg-purple-500/15",
        text: "text-purple-400",
        border: "border-purple-500/30",
        icon: "🅿️",
    },
    "Wudu Area": {
        bg: "bg-teal-500/15",
        text: "text-teal-400",
        border: "border-teal-500/30",
        icon: "💧",
    },
    "Women Section": {
        bg: "bg-pink-500/15",
        text: "text-pink-400",
        border: "border-pink-500/30",
        icon: "👩",
    },
};

const defaultConfig = {
    bg: "bg-gray-500/15",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: "🏷️",
};

export default function Tag({ label, className = "" }) {
    const config = statusConfig[label] || defaultConfig;

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-lg
        text-xs font-medium
        border
        ${config.bg} ${config.text} ${config.border}
        ${className}
      `}
        >
            <span>{config.icon}</span>
            <span>{label}</span>
        </span>
    );
}
