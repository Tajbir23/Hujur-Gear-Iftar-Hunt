"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Map, List, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import MosqueList from "@/components/iftar/MosqueList";
import AddMosqueModal from "@/components/iftar/AddMosqueModal";
import IftarMenuForm from "@/components/iftar/IftarMenuForm";
import { useGeolocation } from "@/hooks/useGeolocation";

const MapView = dynamic(() => import("@/components/iftar/MapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] rounded-xl bg-bg-card border border-border flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    ),
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IftarCrashPage() {
    const { lat, lng, error: geoError, loading: geoLoading } = useGeolocation();
    const [viewMode, setViewMode] = useState("map");
    const [addMosqueOpen, setAddMosqueOpen] = useState(false);
    const [selectedMosque, setSelectedMosque] = useState(null);
    const [menuFormOpen, setMenuFormOpen] = useState(false);

    const { data, mutate } = useSWR(
        lat && lng ? `/api/mosques?lat=${lat}&lng=${lng}&radius=20000` : null,
        fetcher,
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
            dedupingInterval: 30000,
        }
    );

    const mosques = useMemo(() => data?.mosques || [], [data]);

    const handleSelectMosque = (mosque) => {
        setSelectedMosque(mosque);
        setMenuFormOpen(true);
    };

    const handleMosqueAdded = () => {
        mutate();
    };

    const handleIftarUpdated = () => {
        mutate();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* পেজ হেডার */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                            🍛 ইফতার ক্র্যাশ
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            কাছাকাছি মসজিদে আজকের ইফতারের মেনু খুঁজুন। ব্যাচেলর এডিশন।
                        </p>
                    </div>

                    {/* ভিউ টগল */}
                    <div className="flex items-center gap-2 bg-bg-surface rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setViewMode("map")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "map"
                                ? "bg-primary text-white shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <Map size={16} />
                            ম্যাপ
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${viewMode === "list"
                                ? "bg-primary text-white shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <List size={16} />
                            লিস্ট
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* জিও এরর */}
            {geoError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                    📍 {geoError}
                </div>
            )}

            {/* লোকেশন লোড হচ্ছে */}
            {geoLoading && (
                <div className="mb-6 bg-blue-500/10 border border-blue-500/25 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-400">
                    <Loader2 className="animate-spin" size={18} />
                    আপনার লোকেশন নির্ণয় করা হচ্ছে...
                </div>
            )}

            {/* কন্টেন্ট */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {viewMode === "map" ? (
                    <MapView
                        lat={lat}
                        lng={lng}
                        onSelectMosque={handleSelectMosque}
                        onAddMosque={() => setAddMosqueOpen(true)}
                    />
                ) : (
                    <MosqueList
                        mosques={mosques}
                        onSelectMosque={handleSelectMosque}
                    />
                )}
            </motion.div>

            {/* ফ্লোটিং অ্যাড বাটন (লিস্ট ভিউ) */}
            {viewMode === "list" && lat && lng && (
                <div className="fixed bottom-6 right-6 z-30">
                    <Button
                        variant="accent"
                        size="lg"
                        onClick={() => setAddMosqueOpen(true)}
                        className="shadow-elevated rounded-full"
                    >
                        ➕ মসজিদ যোগ করুন
                    </Button>
                </div>
            )}

            {/* মোডালস */}
            <AddMosqueModal
                isOpen={addMosqueOpen}
                onClose={() => setAddMosqueOpen(false)}
                lat={lat}
                lng={lng}
                onSuccess={handleMosqueAdded}
            />

            {selectedMosque && (
                <IftarMenuForm
                    isOpen={menuFormOpen}
                    onClose={() => {
                        setMenuFormOpen(false);
                        setSelectedMosque(null);
                    }}
                    mosque={selectedMosque}
                    userLat={lat}
                    userLng={lng}
                    onSuccess={handleIftarUpdated}
                />
            )}
        </div>
    );
}
