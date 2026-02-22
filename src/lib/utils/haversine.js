/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Check if a user is within the allowed radius of a mosque.
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} mosqueLat - Mosque's latitude
 * @param {number} mosqueLon - Mosque's longitude
 * @param {number} maxDistanceMeters - Maximum allowed distance (default 500m)
 * @returns {{ withinRange: boolean, distance: number }}
 */
export function isWithinGeoFence(userLat, userLon, mosqueLat, mosqueLon, maxDistanceMeters = 500) {
    const distance = haversineDistance(userLat, userLon, mosqueLat, mosqueLon);
    return {
        withinRange: distance <= maxDistanceMeters,
        distance: Math.round(distance),
    };
}
