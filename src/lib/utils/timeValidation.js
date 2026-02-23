/**
 * সময় ইউটিলিটিস — ঢাকা টাইমজোন (UTC+6)
 */

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
