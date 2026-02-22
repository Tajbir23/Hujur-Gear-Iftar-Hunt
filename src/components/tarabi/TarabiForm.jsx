"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getApiHeaders } from "@/lib/utils/deviceId";

export default function TarabiForm({ isOpen, onClose, mosque, userLat, userLng, onSuccess }) {
    const [startTime, setStartTime] = useState("20:15");
    const [endTime, setEndTime] = useState("22:00");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startTime || !endTime) {
            setError("শুরু ও শেষ উভয় সময় দিতে হবে।");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/tarabi-update", {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({
                    mosqueId: mosque._id,
                    startTime,
                    endTime,
                    userLat,
                    userLng,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            onSuccess?.(data.update);
            onClose();
        } catch {
            setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    const getDurationPreview = () => {
        if (!startTime || !endTime) return null;
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        let diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return hours > 0 ? `${hours} ঘণ্টা ${mins} মিনিট` : `${mins} মিনিট`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🚀 তারাবির সময় জমা দিন">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* মসজিদের তথ্য */}
                <div className="bg-bg-surface rounded-lg p-3">
                    <p className="text-sm font-medium text-text-primary">
                        🕌 {mosque?.name}
                    </p>
                </div>

                {/* সময় ইনপুট */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            শুরুর সময় *
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            শেষের সময় *
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* সময়কাল প্রিভিউ */}
                {getDurationPreview() && (
                    <div className="bg-accent/10 border border-accent/25 rounded-lg p-3 text-center">
                        <span className="text-accent font-semibold text-lg">
                            ⏱️ {getDurationPreview()}
                        </span>
                        <p className="text-xs text-text-muted mt-0.5">
                            মোট নামাজের সময়কাল
                        </p>
                    </div>
                )}

                {/* জিও-ফেন্স নোটিশ */}
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-lg p-3 text-xs text-blue-400">
                    📍 মসজিদ থেকে ৫০০ মিটারের মধ্যে থাকতে হবে। তারাবির সময় জমা দেওয়া
                    যাবে শুধু রাত ৭:৩০ থেকে ১১:৩০ এর মধ্যে।
                </div>

                {/* এরর */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                        ⚠️ {error}
                    </div>
                )}

                {/* সাবমিট */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                    >
                        বাতিল
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        className="flex-1"
                    >
                        🚀 সময় জমা দিন
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
