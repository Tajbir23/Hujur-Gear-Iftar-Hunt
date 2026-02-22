"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import useSWR from "swr";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import "leaflet/dist/leaflet.css";

const mosqueIcon = typeof window !== "undefined"
    ? new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })
    : null;

const userIcon = typeof window !== "undefined"
    ? new L.DivIcon({
        className: "user-location-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    })
    : null;

const fetcher = (url) => fetch(url).then((res) => res.json());

function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 14);
        }
    }, [lat, lng, map]);
    return null;
}

export default function MapView({ lat, lng, onSelectMosque, onAddMosque }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, error, isLoading } = useSWR(
        lat && lng ? `/api/mosques?lat=${lat}&lng=${lng}&radius=5000` : null,
        fetcher,
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
            dedupingInterval: 30000,
        }
    );

    const mosques = useMemo(() => data?.mosques || [], [data]);

    if (!mounted) {
        return (
            <div className="w-full h-[500px] rounded-xl bg-bg-card border border-border flex items-center justify-center">
                <div className="animate-pulse text-text-muted">ম্যাপ লোড হচ্ছে...</div>
            </div>
        );
    }

    if (!lat || !lng) {
        return (
            <div className="w-full h-[500px] rounded-xl bg-bg-card border border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                    <span className="text-4xl">📍</span>
                    <p className="text-text-secondary">আপনার লোকেশন নির্ণয় করা হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                className="w-full h-[500px] rounded-xl border border-border"
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap lat={lat} lng={lng} />

                {userIcon && (
                    <Marker position={[lat, lng]} icon={userIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>📍 আপনি এখানে আছেন</strong>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {mosques.map((mosque) => (
                    <Marker
                        key={mosque._id}
                        position={[
                            mosque.location.coordinates[1],
                            mosque.location.coordinates[0],
                        ]}
                        icon={mosqueIcon}
                    >
                        <Popup maxWidth={280}>
                            <div className="space-y-2 min-w-[200px]">
                                <h3 className="font-semibold text-sm">🕌 {mosque.name}</h3>
                                {mosque.address && (
                                    <p className="text-xs opacity-80">{mosque.address}</p>
                                )}
                                {mosque.facilities?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {mosque.facilities.map((f) => (
                                            <span
                                                key={f}
                                                className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <button
                                    onClick={() => onSelectMosque?.(mosque)}
                                    className="w-full mt-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors cursor-pointer"
                                >
                                    বিস্তারিত দেখুন / আপডেট দিন
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* ফ্লোটিং মসজিদ যোগ বাটন */}
            <div className="absolute bottom-4 right-4 z-[1000]">
                <Button
                    variant="accent"
                    size="md"
                    onClick={onAddMosque}
                    className="shadow-elevated"
                >
                    ➕ এখানে মসজিদ যোগ করুন
                </Button>
            </div>

            {/* মসজিদ সংখ্যা ব্যাজ */}
            <div className="absolute top-4 left-4 z-[1000]">
                <Badge color="emerald" dot>
                    {isLoading ? "লোড হচ্ছে..." : `${mosques.length}টি মসজিদ কাছাকাছি`}
                </Badge>
            </div>
        </div>
    );
}
