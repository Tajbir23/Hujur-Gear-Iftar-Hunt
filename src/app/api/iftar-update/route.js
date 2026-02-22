import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Mosque from "@/lib/models/Mosque";
import IftarUpdate from "@/lib/models/IftarUpdate";
import { getClientIp, getDeviceId, checkRateLimit, getTodayDate } from "@/lib/utils/fingerprint";
import { isWithinGeoFence } from "@/lib/utils/haversine";
import { isIftarWindow } from "@/lib/utils/timeValidation";

/**
 * POST /api/iftar-update
 * ইফতার মেনু আপডেট জমা দিন
 *
 * ভ্যালিডেশন পাইপলাইন:
 * ১. সময় উইন্ডো চেক (আসর–মাগরিব)
 * ২. ডিভাইস ফিঙ্গারপ্রিন্ট
 * ৩. রেট লিমিট (দৈনিক সর্বোচ্চ ২টি)
 * ৪. জিও-ফেন্স চেক (মসজিদ থেকে ৫০০ মিটারের মধ্যে)
 * ৫. MongoDB তে সেভ
 */
export async function POST(request) {
    try {
        // ১. সময় উইন্ডো যাচাই
        const timeCheck = isIftarWindow();
        if (!timeCheck.allowed) {
            return NextResponse.json({ error: timeCheck.message }, { status: 403 });
        }

        // ২. ডিভাইস ফিঙ্গারপ্রিন্ট
        const deviceId = getDeviceId(request);
        if (!deviceId) {
            return NextResponse.json(
                { error: "ডিভাইস আইডি প্রয়োজন। অনুগ্রহ করে কুকি চালু করুন।" },
                { status: 400 }
            );
        }

        const ip = await getClientIp();
        const body = await request.json();
        const { mosqueId, menu, status, userLat, userLng } = body;

        if (!mosqueId || !menu || !Array.isArray(menu) || menu.length === 0) {
            return NextResponse.json(
                { error: "মসজিদ আইডি এবং মেনু (কমপক্ষে ১টি আইটেম) আবশ্যক" },
                { status: 400 }
            );
        }

        if (!userLat || !userLng) {
            return NextResponse.json(
                { error: "যাচাইয়ের জন্য আপনার লোকেশন প্রয়োজন" },
                { status: 400 }
            );
        }

        await connectDB();

        // ৩. রেট লিমিট চেক
        const { allowed } = await checkRateLimit(IftarUpdate, deviceId, ip, 2);
        if (!allowed) {
            return NextResponse.json(
                { error: "আপনি আজকে সর্বোচ্চ ২টি ইফতার আপডেট দিয়েছেন।" },
                { status: 429 }
            );
        }

        // ৪. জিও-ফেন্স চেক — মসজিদ থেকে ৫০০ মি. এর মধ্যে থাকতে হবে
        const mosque = await Mosque.findById(mosqueId).lean();
        if (!mosque) {
            return NextResponse.json({ error: "মসজিদ খুঁজে পাওয়া যায়নি" }, { status: 404 });
        }

        const [mosqueLng, mosqueLat] = mosque.location.coordinates;
        const geoCheck = isWithinGeoFence(userLat, userLng, mosqueLat, mosqueLng, 500);

        if (!geoCheck.withinRange) {
            return NextResponse.json(
                {
                    error: `ইফতার আপডেট দিতে মসজিদ থেকে ৫০০ মিটারের মধ্যে থাকতে হবে। আপনি ${geoCheck.distance} মি. দূরে আছেন।`,
                },
                { status: 403 }
            );
        }

        // ৫. MongoDB তে সেভ
        const today = getTodayDate();
        const iftarUpdate = await IftarUpdate.create({
            mosqueId,
            menu,
            status: status || "Food Available",
            date: today,
            deviceId,
            ip,
        });

        return NextResponse.json(
            { update: iftarUpdate, message: "ইফতার আপডেট সফলভাবে জমা হয়েছে!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/iftar-update error:", error);
        return NextResponse.json({ error: "ইফতার আপডেট জমা দিতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
