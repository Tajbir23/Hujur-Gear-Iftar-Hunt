"use client";

import { v4 as uuidv4 } from "uuid";

const DEVICE_ID_KEY = "ramadan-radar-device-id";

/**
 * Get or create a persistent device fingerprint UUID.
 * Stored in localStorage to survive page reloads.
 * @returns {string} Device UUID
 */
export function getOrCreateDeviceId() {
    if (typeof window === "undefined") return "";

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}

/**
 * Create headers with device ID for API requests.
 * @returns {object} Headers object
 */
export function getApiHeaders() {
    return {
        "Content-Type": "application/json",
        "x-device-id": getOrCreateDeviceId(),
    };
}
