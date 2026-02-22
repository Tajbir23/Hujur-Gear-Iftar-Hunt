"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Leaderboard from "@/components/tarabi/Leaderboard";
import TarabiForm from "@/components/tarabi/TarabiForm";
import Button from "@/components/ui/Button";
import { useGeolocation } from "@/hooks/useGeolocation";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RocketHujurPage() {
    const { lat, lng, error: geoError, loading: geoLoading } = useGeolocation();
    const [selectedMosque, setSelectedMosque] = useState(null);
    const [tarabiFormOpen, setTarabiFormOpen] = useState(false);
    const [showMosquePicker, setShowMosquePicker] = useState(false);

    const { data: mosqueData } = useSWR(
        `/api/mosques`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const mosques = mosqueData?.mosques || [];

    const handleSelectMosque = (mosque) => {
        setSelectedMosque(mosque);
        setTarabiFormOpen(true);
        setShowMosquePicker(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* পেজ হেডার */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                            🚀 রকেট হুজুর ট্র্যাকার
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            কোন মসজিদে ২০ রাকাত তারাবি সবচেয়ে দ্রুত শেষ হয়? কমিউনিটি-ভেরিফাইড লিডারবোর্ড।
                        </p>
                    </div>

                    <Button
                        variant="accent"
                        onClick={() => setShowMosquePicker(!showMosquePicker)}
                    >
                        ⏱️ তারাবির সময় জমা দিন
                    </Button>
                </div>
            </motion.div>

            {/* জিও এরর */}
            {geoError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                    📍 {geoError}
                </div>
            )}

            {/* মসজিদ পিকার */}
            {showMosquePicker && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-bg-card border border-border rounded-xl p-5"
                >
                    <h3 className="text-sm font-semibold text-text-primary mb-3">
                        তারাবির সময় জমা দিতে একটি মসজিদ নির্বাচন করুন:
                    </h3>
                    {geoLoading ? (
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                            <Loader2 className="animate-spin" size={16} />
                            আপনার লোকেশন নির্ণয় করা হচ্ছে...
                        </div>
                    ) : mosques.length === 0 ? (
                        <p className="text-sm text-text-muted">
                            কাছাকাছি কোনো মসজিদ পাওয়া যায়নি। প্রথমে{" "}
                            <a href="/iftar-crash" className="text-primary hover:underline">
                                ইফতার ক্র্যাশ
                            </a>{" "}
                            পেজ থেকে মসজিদ যোগ করুন।
                        </p>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {mosques.map((mosque) => (
                                <button
                                    key={mosque._id}
                                    onClick={() => handleSelectMosque(mosque)}
                                    className="text-left px-4 py-3 rounded-lg bg-bg-surface border border-border hover:border-primary/40 hover:bg-bg-card-hover transition-all text-sm cursor-pointer"
                                >
                                    <span className="font-medium text-text-primary">
                                        🕌 {mosque.name}
                                    </span>
                                    {mosque.address && (
                                        <p className="text-xs text-text-muted mt-0.5 truncate">
                                            {mosque.address}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* লিডারবোর্ড */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Leaderboard onSelectMosque={handleSelectMosque} />
            </motion.div>

            {/* তারাবি ফর্ম মোডাল */}
            {selectedMosque && (
                <TarabiForm
                    isOpen={tarabiFormOpen}
                    onClose={() => {
                        setTarabiFormOpen(false);
                        setSelectedMosque(null);
                    }}
                    mosque={selectedMosque}
                    userLat={lat}
                    userLng={lng}
                />
            )}
        </div>
    );
}
