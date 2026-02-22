"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getApiHeaders } from "@/lib/utils/deviceId";

const menuOptions = [
    "খেজুর ও পানি",
    "বিরিয়ানি",
    "তেহারি",
    "ছোলা-মুড়ি",
    "খিচুড়ি",
    "পোলাও",
    "জিলাপি ও পিয়াজু",
    "হালিম",
    "ফিরনি",
    "মিক্সড আইটেম",
];

const statusOptions = [
    { value: "Food Available", label: "খাবার আছে", emoji: "🍽️", color: "text-green-400" },
    { value: "Very Crowded", label: "অনেক ভিড়", emoji: "👥", color: "text-yellow-400" },
    { value: "Finished", label: "শেষ হয়ে গেছে", emoji: "❌", color: "text-red-400" },
];

export default function IftarMenuForm({ isOpen, onClose, mosque, userLat, userLng, onSuccess }) {
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [status, setStatus] = useState("Food Available");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleMenu = (item) => {
        setSelectedMenu((prev) =>
            prev.includes(item)
                ? prev.filter((m) => m !== item)
                : [...prev, item]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedMenu.length === 0) {
            setError("অন্তত একটি মেনু আইটেম নির্বাচন করুন।");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/iftar-update", {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({
                    mosqueId: mosque._id,
                    menu: selectedMenu,
                    status,
                    userLat,
                    userLng,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSelectedMenu([]);
            setStatus("Food Available");
            onSuccess?.(data.update);
            onClose();
        } catch {
            setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🍛 ইফতার মেনু আপডেট">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* মসজিদের তথ্য */}
                <div className="bg-bg-surface rounded-lg p-3">
                    <p className="text-sm font-medium text-text-primary">
                        🕌 {mosque?.name}
                    </p>
                    {mosque?.address && (
                        <p className="text-xs text-text-muted mt-0.5">{mosque.address}</p>
                    )}
                </div>

                {/* মেনু নির্বাচন */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        আজকের মেনু (যা যা আছে সব সিলেক্ট করুন) *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {menuOptions.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleMenu(item)}
                                className={`
                  px-3 py-2.5 rounded-lg text-sm font-medium
                  border transition-all duration-200 text-left cursor-pointer
                  ${selectedMenu.includes(item)
                                        ? "bg-accent/15 text-accent border-accent/40"
                                        : "bg-bg-surface text-text-secondary border-border hover:border-text-muted"
                                    }
                `}
                            >
                                {selectedMenu.includes(item) ? "✅ " : ""}
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* বর্তমান অবস্থা */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        বর্তমান অবস্থা
                    </label>
                    <div className="flex gap-2">
                        {statusOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setStatus(opt.value)}
                                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-medium
                  border transition-all duration-200 text-center cursor-pointer
                  ${status === opt.value
                                        ? "bg-primary/15 text-primary border-primary/40"
                                        : "bg-bg-surface text-text-secondary border-border hover:border-text-muted"
                                    }
                `}
                            >
                                {opt.emoji} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* জিও-ফেন্স নোটিশ */}
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-lg p-3 text-xs text-blue-400">
                    📍 এই আপডেট জমা দিতে আপনাকে মসজিদ থেকে ৫০০ মিটারের মধ্যে থাকতে হবে।
                    আপনার লোকেশন স্বয়ংক্রিয়ভাবে যাচাই হবে।
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
                        variant="accent"
                        loading={loading}
                        className="flex-1"
                    >
                        মেনু জমা দিন
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
