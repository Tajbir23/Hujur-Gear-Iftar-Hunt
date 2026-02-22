import { headers } from "next/headers";

/**
 * Extract the client IP address from request headers.
 * Works behind reverse proxies (Nginx, Cloudflare, etc.)
 * @returns {string} Client IP address
 */
export async function getClientIp() {
    const headerList = await headers();
    return (
        headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerList.get("x-real-ip") ||
        headerList.get("cf-connecting-ip") ||
        "unknown"
    );
}

/**
 * Extract the device fingerprint UUID sent from the client.
 * The client generates a UUID4 via localStorage on first visit.
 * @param {Request} request - The incoming request object
 * @returns {string|null} Device UUID or null
 */
export function getDeviceId(request) {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId || typeof deviceId !== "string" || deviceId.length > 50) {
        return null;
    }
    return deviceId;
}

/**
 * Get today's date string in YYYY-MM-DD format (UTC+6 Dhaka timezone).
 * @returns {string}
 */
export function getTodayDate() {
    const now = new Date();
    const dhaka = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    return dhaka.toISOString().split("T")[0];
}

/**
 * Check if a device has exceeded the daily rate limit.
 * @param {mongoose.Model} Model - The Mongoose model to check against
 * @param {string} deviceId - Device UUID
 * @param {string} ip - Client IP
 * @param {number} maxPerDay - Maximum submissions per day (default: 2)
 * @returns {{ allowed: boolean, count: number }}
 */
export async function checkRateLimit(Model, deviceId, ip, maxPerDay = 2) {
    const today = getTodayDate();

    const count = await Model.countDocuments({
        date: today,
        $or: [{ deviceId }, { ip }],
    });

    return {
        allowed: count < maxPerDay,
        count,
    };
}
