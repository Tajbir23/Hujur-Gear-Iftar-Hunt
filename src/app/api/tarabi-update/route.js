import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Mosque from "@/lib/models/Mosque";
import TarabiUpdate from "@/lib/models/TarabiUpdate";
import { getClientIp, getDeviceId, checkRateLimit, getTodayDate } from "@/lib/utils/fingerprint";
import { calculateDuration } from "@/lib/utils/timeValidation";

/**
 * POST /api/tarabi-update
 * তারাবি নামাজের সময় জমা দিন
 */
export async function POST(request) {
    try {
        // ডিভাইস ফিঙ্গারপ্রিন্ট
        const deviceId = getDeviceId(request);
        if (!deviceId) {
            return NextResponse.json(
                { error: "ডিভাইস আইডি প্রয়োজন।" },
                { status: 400 }
            );
        }

        const ip = await getClientIp();
        const body = await request.json();
        const { mosqueId, startTime, endTime } = body;

        if (!mosqueId || !startTime || !endTime) {
            return NextResponse.json(
                { error: "মসজিদ আইডি, শুরুর সময় ও শেষের সময় আবশ্যক" },
                { status: 400 }
            );
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return NextResponse.json(
                { error: "সময় HH:MM ফরম্যাটে (২৪ ঘণ্টা) দিতে হবে" },
                { status: 400 }
            );
        }

        await connectDB();

        // ৩. রেট লিমিট
        const { allowed } = await checkRateLimit(TarabiUpdate, deviceId, ip, 2);
        if (!allowed) {
            return NextResponse.json(
                { error: "আপনি আজকে সর্বোচ্চ ২টি তারাবি আপডেট দিয়েছেন।" },
                { status: 429 }
            );
        }

        // মসজিদ যাচাই
        const mosque = await Mosque.findById(mosqueId).lean();
        if (!mosque) {
            return NextResponse.json({ error: "মসজিদ খুঁজে পাওয়া যায়নি" }, { status: 404 });
        }

        // সময়কাল গণনা ও সেভ
        const durationMinutes = calculateDuration(startTime, endTime);



        const today = getTodayDate();
        const tarabiUpdate = await TarabiUpdate.create({
            mosqueId,
            startTime,
            endTime,
            durationMinutes,
            date: today,
            deviceId,
            ip,
        });

        return NextResponse.json(
            { update: tarabiUpdate, message: "তারাবি আপডেট সফলভাবে জমা হয়েছে!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/tarabi-update error:", error);
        return NextResponse.json({ error: "তারাবি আপডেট জমা দিতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
