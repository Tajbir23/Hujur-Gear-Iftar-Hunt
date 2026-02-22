/**
 * সময় যাচাই ইউটিলিটিস — ঢাকা টাইমজোন (UTC+6)
 *
 * ইফতার আপডেট উইন্ডো: বিকাল ৪:০০ — সন্ধ্যা ৬:৩০
 * তারাবি আপডেট উইন্ডো: রাত ৭:৩০ — রাত ১১:৩০
 */

/**
 * বর্তমান ঢাকা সময় নেওয়া (UTC+6)
 */
function getDhakaTime() {
    const now = new Date();
    const offsetMs = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + offsetMs;
    return new Date(dhakaMs);
}

/**
 * ঘণ্টা ও মিনিটকে দশমিক সংখ্যায় রূপান্তর
 */
function toDecimalHour(hours, minutes) {
    return hours + minutes / 60;
}

/**
 * ইফতার আপডেট উইন্ডোতে আছেন কিনা চেক
 * অনুমোদিত: বিকাল ৪:০০ — সন্ধ্যা ৬:৩০ (ঢাকা সময়)
 */
export function isIftarWindow() {
    const dhaka = getDhakaTime();
    const currentHour = toDecimalHour(dhaka.getHours(), dhaka.getMinutes());

    const startHour = 16.0; // বিকাল ৪:০০
    const endHour = 18.5; // সন্ধ্যা ৬:৩০

    if (currentHour >= startHour && currentHour <= endHour) {
        return { allowed: true };
    }

    return {
        allowed: false,
        message: `ইফতার আপডেট শুধুমাত্র বিকাল ৪:০০ থেকে সন্ধ্যা ৬:৩০ (ঢাকা সময়) এর মধ্যে দেওয়া যাবে। বর্তমান ঢাকা সময়: ${dhaka.toLocaleTimeString(
            "bn-BD",
            { hour: "2-digit", minute: "2-digit", hour12: true }
        )}`,
    };
}

/**
 * তারাবি আপডেট উইন্ডোতে আছেন কিনা চেক
 * অনুমোদিত: রাত ৭:৩০ — রাত ১১:৩০ (ঢাকা সময়)
 */
export function isTarabiWindow() {
    const dhaka = getDhakaTime();
    const currentHour = toDecimalHour(dhaka.getHours(), dhaka.getMinutes());

    const startHour = 19.5; // রাত ৭:৩০
    const endHour = 23.5; // রাত ১১:৩০

    if (currentHour >= startHour && currentHour <= endHour) {
        return { allowed: true };
    }

    return {
        allowed: false,
        message: `তারাবি আপডেট শুধুমাত্র রাত ৭:৩০ থেকে ১১:৩০ (ঢাকা সময়) এর মধ্যে দেওয়া যাবে। বর্তমান ঢাকা সময়: ${dhaka.toLocaleTimeString(
            "bn-BD",
            { hour: "2-digit", minute: "2-digit", hour12: true }
        )}`,
    };
}

/**
 * শুরু ও শেষ সময় থেকে সময়কাল (মিনিটে) গণনা
 * ফরম্যাট: "HH:MM" (২৪ ঘণ্টা)
 */
export function calculateDuration(startStr, endStr) {
    const [sh, sm] = startStr.split(":").map(Number);
    const [eh, em] = endStr.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    // মধ্যরাত পার হলে
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }

    return endMinutes - startMinutes;
}
