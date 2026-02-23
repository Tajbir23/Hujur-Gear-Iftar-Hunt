"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
    ArrowLeft, RefreshCw, Activity, Building2, Utensils, Moon,
    MapPin, MapPinOff, EyeOff, ThumbsUp, ThumbsDown, Clock
} from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff} সেকেন্ড আগে`;
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
    return `${Math.floor(diff / 86400)} দিন আগে`;
}

const TYPE_CONFIG = {
    mosque: {
        icon: Building2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        dot: "bg-emerald-500",
    },
    iftar: {
        icon: Utensils,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        dot: "bg-amber-500",
    },
    tarabi: {
        icon: Moon,
        color: "text-purple-400",
        bg: "bg-purple-500/10 border-purple-500/30",
        dot: "bg-purple-500",
    },
};

function ActivityCard({ item }) {
    const cfg = TYPE_CONFIG[item.type];
    const Icon = cfg.icon;

    return (
        <div className={`bg-bg-card border rounded-xl p-4 relative ${item.hidden ? "opacity-50" : ""}`}>
            {/* Left color bar */}
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${cfg.dot}`} />

            <div className="pl-2">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            <Icon size={11} />
                            {item.label}
                        </span>
                        {item.hidden && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                                <EyeOff size={11} /> Hidden
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-text-muted shrink-0">{timeAgo(item.createdAt)}</div>
                </div>

                {/* Mosque addition details */}
                {item.type === "mosque" && (
                    <div className="space-y-1.5">
                        <div className="font-semibold text-text-primary text-sm">{item.name}</div>
                        {item.address ? (
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                <MapPin size={12} className="shrink-0 text-emerald-400" />
                                {item.address}
                            </div>
                        ) : (
                            <div className="text-xs text-text-muted italic">ঠিকানা দেওয়া হয়নি</div>
                        )}
                        {item.hasCoords && item.coords ? (
                            <div className="text-xs text-text-muted font-mono">
                                📍 {item.coords[1].toFixed(5)}, {item.coords[0].toFixed(5)}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-xs text-amber-400">
                                <MapPinOff size={11} /> কোঅর্ডিনেট নেই (address-only)
                            </div>
                        )}
                        {item.facilities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {item.facilities.map(f => (
                                    <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface text-text-muted border border-border">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Iftar update details */}
                {item.type === "iftar" && (
                    <div className="space-y-1">
                        <div className="font-semibold text-text-primary text-sm">{item.mosqueName}</div>
                        {item.mosqueAddress && (
                            <div className="flex items-center gap-1 text-xs text-text-secondary">
                                <MapPin size={11} /> {item.mosqueAddress}
                            </div>
                        )}
                        <div className="text-xs text-text-secondary">🍛 {item.menu?.join(", ")}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "Food Available" ? "bg-emerald-500/20 text-emerald-400"
                                : item.status === "Very Crowded" ? "bg-amber-500/20 text-amber-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}>{item.status}</span>
                            <VoteBadge fact={item.factVotes} fake={item.fakeVotes} />
                        </div>
                    </div>
                )}

                {/* Tarabi update details */}
                {item.type === "tarabi" && (
                    <div className="space-y-1">
                        <div className="font-semibold text-text-primary text-sm">{item.mosqueName}</div>
                        {item.mosqueAddress && (
                            <div className="flex items-center gap-1 text-xs text-text-secondary">
                                <MapPin size={11} /> {item.mosqueAddress}
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Clock size={11} />
                            {item.startTime} → {item.endTime}
                            <span className="text-purple-400 font-semibold">{item.durationMinutes} মিনিট</span>
                        </div>
                        <VoteBadge fact={item.factVotes} fake={item.fakeVotes} />
                    </div>
                )}

                {/* Device / IP footer */}
                <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-border/50 text-[10px] text-text-muted font-mono">
                    <span title="Device ID">📱 {(item.deviceId || "—").slice(0, 12)}…</span>
                    <span title="IP Address">🌐 {item.ip || "—"}</span>
                </div>
            </div>
        </div>
    );
}

function VoteBadge({ fact, fake }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
                <ThumbsUp size={10} /> {fact}
            </span>
            <span className="flex items-center gap-1 text-red-400">
                <ThumbsDown size={10} /> {fake}
            </span>
        </div>
    );
}

const FILTERS = ["সব", "মসজিদ", "ইফতার", "তারাবি"];
const FILTER_TYPES = { "সব": null, "মসজিদ": "mosque", "ইফতার": "iftar", "তারাবি": "tarabi" };

export default function AdminActivity() {
    const [activeFilter, setActiveFilter] = useState("সব");
    const { data, error, isLoading, mutate } = useSWR(
        "/api/admin/activity?limit=80",
        fetcher,
        { refreshInterval: 30000 }
    );

    const filtered = data?.feed?.filter(
        (item) => !FILTER_TYPES[activeFilter] || item.type === FILTER_TYPES[activeFilter]
    ) || [];

    return (
        <div className="min-h-screen bg-bg-base p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
                <Link
                    href="/admin"
                    className="p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Activity size={24} className="text-primary" />
                        User Activity Feed
                    </h1>
                    <p className="text-text-muted text-sm mt-0.5">
                        Real-time user submissions — মসজিদ, ইফতার ও তারাবি
                    </p>
                </div>
                <button
                    onClick={() => mutate()}
                    className="p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary transition-all"
                    title="Refresh"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === f
                            ? "bg-primary text-white shadow"
                            : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        {f}
                        {data?.feed && (
                            <span className="ml-1.5 text-xs opacity-70">
                                ({data.feed.filter(i => !FILTER_TYPES[f] || i.type === FILTER_TYPES[f]).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    ⚠️ লোড করতে সমস্যা — {error.message}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-text-muted py-20">Loading activity...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center text-text-muted py-20 bg-bg-card border border-border rounded-xl">
                    <Activity size={40} className="mx-auto opacity-30 mb-3" />
                    <p>কোনো activity নেই।</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((item) => (
                        <ActivityCard key={`${item.type}-${item._id}`} item={item} />
                    ))}
                </div>
            )}

            {data?.feed && (
                <p className="text-center text-text-muted text-xs mt-8">
                    সর্বশেষ {data.feed.length}টি activity দেখাচ্ছে • Auto-refreshes every 30s
                </p>
            )}
        </div>
    );
}
