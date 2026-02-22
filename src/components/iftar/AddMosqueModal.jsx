"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getApiHeaders } from "@/lib/utils/deviceId";

const facilityOptions = [
    "এসি আছে",
    "ভালো ফ্যান আছে",
    "পার্কিং",
    "ওযু করার জায়গা",
    "মহিলা বিভাগ",
];

export default function AddMosqueModal({ isOpen, onClose, lat, lng, onSuccess }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleFacility = (facility) => {
        setFacilities((prev) =>
            prev.includes(facility)
                ? prev.filter((f) => f !== facility)
                : [...prev, facility]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/mosques", {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({
                    name: name.trim(),
                    lat,
                    lng,
                    address: address.trim(),
                    facilities,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setName("");
            setAddress("");
            setFacilities([]);
            onSuccess?.(data.mosque);
            onClose();
        } catch {
            setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🕌 নতুন মসজিদ যোগ করুন">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* লোকেশন তথ্য */}
                <div className="bg-bg-surface rounded-lg p-3 text-sm text-text-secondary">
                    📍 লোকেশন: {lat?.toFixed(5)}, {lng?.toFixed(5)}
                    <p className="text-xs text-text-muted mt-1">
                        এই মসজিদ আপনার বর্তমান জিপিএস লোকেশনে পিন করা হবে।
                    </p>
                </div>

                {/* নাম */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        মসজিদের নাম *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='যেমন: "বায়তুল মুকাররম মসজিদ"'
                        maxLength={100}
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                    />
                </div>

                {/* ঠিকানা */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='যেমন: "রোড ৫, ধানমন্ডি, ঢাকা"'
                        maxLength={200}
                        className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                    />
                </div>

                {/* সুবিধাসমূহ */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        সুবিধাসমূহ
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {facilityOptions.map((facility) => (
                            <button
                                key={facility}
                                type="button"
                                onClick={() => toggleFacility(facility)}
                                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium
                  border transition-all duration-200 cursor-pointer
                  ${facilities.includes(facility)
                                        ? "bg-primary/15 text-primary border-primary/40"
                                        : "bg-bg-surface text-text-secondary border-border hover:border-text-muted"
                                    }
                `}
                            >
                                {facility}
                            </button>
                        ))}
                    </div>
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
                        মসজিদ যোগ করুন
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
