"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * HTML5 Geolocation কাস্টম হুক
 * ব্রাউজার থেকে ব্যবহারকারীর ল্যাটিচ্যুড/লঙ্গিচ্যুড নেয়
 */
export function useGeolocation() {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
                setLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError(
                            "লোকেশন অনুমতি প্রত্যাখ্যান করা হয়েছে। অনুগ্রহ করে ব্রাউজার সেটিংস থেকে লোকেশন চালু করুন।"
                        );
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("লোকেশন তথ্য পাওয়া যাচ্ছে না।");
                        break;
                    case err.TIMEOUT:
                        setError("লোকেশন নির্ণয় করতে সময় শেষ হয়ে গেছে।");
                        break;
                    default:
                        setError("অজানা সমস্যা হয়েছে।");
                        break;
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000,
            }
        );
    }, []);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    return {
        lat,
        lng,
        error,
        loading,
        refresh: getLocation,
    };
}
