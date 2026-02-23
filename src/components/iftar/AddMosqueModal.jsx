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

    // কাস্টম কোঅর্ডিনেট
    const [locationMode, setLocationMode] = useState("gps"); // 'gps' | 'custom' | 'address'
    const [customLat, setCustomLat] = useState("");
    const [customLng, setCustomLng] = useState("");

    const useCustomCoords = locationMode === "custom";

    const toggleFacility = (facility) => {
        setFacilities((prev) =>
            prev.includes(facility)
                ? prev.filter((f) => f !== facility)
                : [...prev, facility]
        );
    };

    // ফাইনাল ল্যাট/লং নির্ধারণ
    const finalLat = locationMode === "custom" ? parseFloat(customLat) : lat;
    const finalLng = locationMode === "custom" ? parseFloat(customLng) : lng;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (locationMode === "address") {
            if (!address.trim()) {
                setError("ঠিকানা মোডে ঠিকানা দিতে হবে।");
                return;
            }
        } else if (locationMode === "custom" && (isNaN(finalLat) || isNaN(finalLng))) {
            setError("সঠিক অক্ষাংশ ও দ্রাঘিমাংশ দিন। Google Maps থেকে কপি করুন।");
            return;
        } else if (locationMode === "gps" && (!finalLat || !finalLng)) {
            setError("লোকেশন পাওয়া যায়নি। কাস্টম কোঅর্ডিনেট বা ঠিকানা ব্যবহার করুন।");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/mosques", {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({
                    name: name.trim(),
                    lat: locationMode !== "address" ? finalLat : undefined,
                    lng: locationMode !== "address" ? finalLng : undefined,
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
            setCustomLat("");
            setCustomLng("");
            setLocationMode("gps");
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

                {/* লোকেশন সোর্স টগল */}
                <div className="space-y-3">
                    {/* লোকেশন সোর্স টগল — তিনটি অপশন */}
                    <div className="flex items-center gap-2 bg-bg-surface rounded-lg p-2 border border-border">
                        <button
                            type="button"
                            onClick={() => setLocationMode("gps")}
                            className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${locationMode === "gps" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            📍 জিপিএস
                        </button>
                        <button
                            type="button"
                            onClick={() => setLocationMode("custom")}
                            className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${locationMode === "custom" ? "bg-primary text-white shadow-md" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            🗺️ কোঅর্ডিনেট
                        </button>
                        <button
                            type="button"
                            onClick={() => setLocationMode("address")}
                            className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${locationMode === "address" ? "bg-accent text-white shadow-md" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            📝 শুধু ঠিকানা
                        </button>
                    </div>

                    {/* জিপিএস লোকেশন তথ্য */}
                    {locationMode === "gps" && (
                        <div className="bg-bg-surface rounded-lg p-3 text-sm text-text-secondary">
                            📍 লোকেশন: {lat?.toFixed(5) || "—"}, {lng?.toFixed(5) || "—"}
                            <p className="text-xs text-text-muted mt-1">
                                আপনার বর্তমান জিপিএস লোকেশনে মসজিদ পিন করা হবে।
                            </p>
                        </div>
                    )}

                    {/* কাস্টম কোঅর্ডিনেট ইনপুট */}
                    {locationMode === "custom" && (
                        <div className="space-y-3">
                            {/* Google Maps গাইড */}
                            <div className="bg-accent/10 border border-accent/25 rounded-lg p-3 text-xs text-accent space-y-1.5">
                                <p className="font-semibold">🗺️ Google Maps থেকে কোঅর্ডিনেট নেওয়ার নিয়ম:</p>
                                <ol className="list-decimal list-inside space-y-1 text-text-secondary">
                                    <li>
                                        <a
                                            href="https://maps.google.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary underline"
                                        >
                                            Google Maps
                                        </a>
                                        {" "}খুলুন
                                    </li>
                                    <li>মসজিদটি খুঁজে বের করুন</li>
                                    <li>মসজিদের উপর <strong>রাইট-ক্লিক</strong> করুন (মোবাইলে লং-প্রেস)</li>
                                    <li>প্রথম অপশনে <strong>কোঅর্ডিনেট</strong> দেখাবে — ক্লিক করে কপি করুন</li>
                                    <li>কপি করা ভ্যালু এখানে পেস্ট করুন (কমা দিয়ে আলাদা)</li>
                                </ol>
                            </div>

                            {/* পেস্ট ফিল্ড — একটা ফিল্ডে কমা দিয়ে দুটো দেওয়া যাবে */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                    কোঅর্ডিনেট পেস্ট করুন
                                </label>
                                <input
                                    type="text"
                                    placeholder='যেমন: 23.81050, 90.41250'
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.includes(",")) {
                                            const parts = val.split(",").map((s) => s.trim());
                                            if (parts.length === 2) {
                                                setCustomLat(parts[0]);
                                                setCustomLng(parts[1]);
                                            }
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                                />
                                <p className="text-xs text-text-muted mt-1">
                                    Google Maps থেকে কপি করে সরাসরি পেস্ট করুন (যেমন: 23.81050, 90.41250)
                                </p>
                            </div>

                            {/* আলাদা ল্যাট/লং ফিল্ড */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary mb-1">
                                        অক্ষাংশ (Latitude)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={customLat}
                                        onChange={(e) => setCustomLat(e.target.value)}
                                        placeholder="23.81050"
                                        className="w-full px-3 py-2 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-secondary mb-1">
                                        দ্রাঘিমাংশ (Longitude)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={customLng}
                                        onChange={(e) => setCustomLng(e.target.value)}
                                        placeholder="90.41250"
                                        className="w-full px-3 py-2 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            {/* প্রিভিউ */}
                            {customLat && customLng && !isNaN(parseFloat(customLat)) && !isNaN(parseFloat(customLng)) && (
                                <div className="bg-green-500/10 border border-green-500/25 rounded-lg p-2.5 text-xs text-green-400">
                                    ✅ কোঅর্ডিনেট সেট হয়েছে: {parseFloat(customLat).toFixed(5)}, {parseFloat(customLng).toFixed(5)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ঠিকানা-অনলি নোটিস */}
                    {locationMode === "address" && (
                        <div className="bg-accent/10 border border-accent/25 rounded-lg p-3 text-xs text-accent space-y-1">
                            <p className="font-semibold">📝 শুধু ঠিকানা মোড</p>
                            <p className="text-text-secondary">মসজিদটি ম্যাপে দেখাবে না, তবে ঠিকানা সর্চ থেকে খুঁজে পাওয়া যাবে।</p>
                        </div>
                    )}
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
                        ঠিকানা {locationMode === "address" ? <span className="text-red-400">*</span> : "(ঐচ্ছিক)"}
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={locationMode === "address" ? 'যেমন: "ধানমন্ডি ৫ নম্বর রোড, ঢাকা-১২০৫"' : 'যেমন: "রোড ৫, ধানমন্ডি, ঢাকা"'}
                        maxLength={200}
                        required={locationMode === "address"}
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
