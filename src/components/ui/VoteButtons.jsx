"use client";

import { useState, useRef, useCallback } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { getApiHeaders } from "@/lib/utils/deviceId";

export default function VoteButtons({
    targetId,
    targetType,
    initialFact = 0,
    initialFake = 0,
}) {
    const [factVotes, setFactVotes] = useState(initialFact);
    const [fakeVotes, setFakeVotes] = useState(initialFake);
    const [voted, setVoted] = useState(null); // "fact" | "fake" | null
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const submitVote = useCallback(
        async (vote) => {
            setLoading(true);
            try {
                const res = await fetch("/api/vote", {
                    method: "POST",
                    headers: getApiHeaders(),
                    body: JSON.stringify({ targetId, targetType, vote }),
                });

                const data = await res.json();

                if (res.ok) {
                    setFactVotes(data.factVotes);
                    setFakeVotes(data.fakeVotes);
                    setVoted(vote);
                }
            } catch {
                // নিরবে ব্যর্থ
            } finally {
                setLoading(false);
            }
        },
        [targetId, targetType]
    );

    const handleVote = (vote) => {
        if (voted || loading) return;

        // ৫০০ms ডিবাউন্স
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => submitVote(vote), 500);
    };

    return (
        <div className="flex items-center gap-3 text-xs">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote("fact");
                }}
                disabled={voted !== null || loading}
                className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-md
          transition-all duration-200 cursor-pointer
          ${voted === "fact"
                        ? "bg-green-500/20 text-green-400"
                        : "text-text-muted hover:text-green-400 hover:bg-green-500/10"
                    }
          ${voted !== null || loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
            >
                <ThumbsUp size={13} />
                <span>সত্য ({factVotes})</span>
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote("fake");
                }}
                disabled={voted !== null || loading}
                className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-md
          transition-all duration-200 cursor-pointer
          ${voted === "fake"
                        ? "bg-red-500/20 text-red-400"
                        : "text-text-muted hover:text-red-400 hover:bg-red-500/10"
                    }
          ${voted !== null || loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
            >
                <ThumbsDown size={13} />
                <span>ভুয়া ({fakeVotes})</span>
            </button>
        </div>
    );
}
