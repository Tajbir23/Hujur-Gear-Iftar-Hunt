"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import VoteButtons from "@/components/ui/VoteButtons";
import { Clock, Flame } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const podiumStyles = {
    0: "podium-gold border-2 border-yellow-500/40",
    1: "podium-silver border-2 border-gray-400/30",
    2: "podium-bronze border-2 border-orange-700/30",
};

const rankEmojis = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ onSelectMosque }) {
    const { data, error, isLoading } = useSWR("/api/leaderboard", fetcher, {
        refreshInterval: 120000,
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });

    const leaderboard = data?.leaderboard || [];

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-24 rounded-xl bg-bg-card border border-border animate-shimmer"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 space-y-3">
                <span className="text-5xl">⚠️</span>
                <p className="text-red-400">লিডারবোর্ড লোড করতে সমস্যা হয়েছে</p>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="text-center py-16 space-y-3">
                <span className="text-5xl">🚀</span>
                <p className="text-text-secondary text-lg">
                    আজকে কোনো তারাবির সময় জমা পড়েনি
                </p>
                <p className="text-text-muted text-sm">
                    আপনার মসজিদের গতি প্রথমে ট্র্যাক করুন!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* শীর্ষ ৩ পডিয়াম */}
            {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                        <motion.div
                            key={entry._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.4 }}
                            className={`rounded-xl p-4 text-center ${podiumStyles[index]}`}
                        >
                            <span className="text-3xl">{rankEmojis[index]}</span>
                            <h3 className="font-bold text-sm text-white mt-2 truncate">
                                {entry.mosqueName}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mt-1.5">
                                <Clock size={12} className="text-white/80" />
                                <span className="text-lg font-bold text-white">
                                    {entry.durationMinutes} মি.
                                </span>
                            </div>
                            <p className="text-[10px] text-white/70 mt-1">
                                {entry.startTime} → {entry.endTime}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* সম্পূর্ণ র‍্যাংকিং */}
            <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                    <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                        <Card
                            hover
                            className="cursor-pointer"
                            onClick={() => onSelectMosque?.({ _id: entry.mosqueId, name: entry.mosqueName })}
                        >
                            <div className="flex items-center gap-4">
                                {/* র‍্যাংক */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
                                    {index < 3 ? (
                                        <span className="text-xl">{rankEmojis[index]}</span>
                                    ) : (
                                        <span className="text-sm font-bold text-text-muted">
                                            #{index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* তথ্য */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text-primary text-sm truncate">
                                        🕌 {entry.mosqueName}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-text-muted">
                                            {entry.startTime} → {entry.endTime}
                                        </span>
                                        {entry.mosqueAddress && (
                                            <span className="text-xs text-text-muted truncate">
                                                📍 {entry.mosqueAddress}
                                            </span>
                                        )}
                                    </div>
                                    {entry.facilities?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {entry.facilities.map((f) => (
                                                <Tag key={f} label={f} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* সময়কাল */}
                                <div className="flex-shrink-0 text-right">
                                    <div className="flex items-center gap-1.5">
                                        {index === 0 && <Flame size={16} className="text-accent" />}
                                        <span
                                            className={`text-xl font-bold ${index === 0
                                                    ? "text-accent"
                                                    : index < 3
                                                        ? "text-primary-light"
                                                        : "text-text-primary"
                                                }`}
                                        >
                                            {entry.durationMinutes} মি.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ভোট বাটন */}
                            <div className="mt-3 pt-3 border-t border-border">
                                <VoteButtons
                                    targetId={entry._id}
                                    targetType="tarabi"
                                    initialFact={entry.factVotes}
                                    initialFake={entry.fakeVotes}
                                />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
