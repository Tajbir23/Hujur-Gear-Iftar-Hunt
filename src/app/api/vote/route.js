import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import IftarUpdate from "@/lib/models/IftarUpdate";
import TarabiUpdate from "@/lib/models/TarabiUpdate";
import { getClientIp, getDeviceId } from "@/lib/utils/fingerprint";

/**
 * POST /api/vote
 * কমিউনিটি ফ্যাক্ট-চেকিং: আপভোট (সত্য) বা ডাউনভোট (ভুয়া)
 *
 * Body: { targetId, targetType: "iftar"|"tarabi", vote: "fact"|"fake" }
 *
 * নিয়ম:
 * - প্রতিটি ডিভাইস/আইপি একটি পোস্টে একবারই ভোট দিতে পারবে
 * - ৫টি "ভুয়া" ভোট পেলে পোস্ট স্বয়ংক্রিয়ভাবে লুকানো হবে
 */
export async function POST(request) {
    try {
        const deviceId = getDeviceId(request);
        if (!deviceId) {
            return NextResponse.json({ error: "ডিভাইস আইডি প্রয়োজন।" }, { status: 400 });
        }

        const ip = await getClientIp();
        const body = await request.json();
        const { targetId, targetType, vote } = body;

        if (!targetId || !targetType || !vote) {
            return NextResponse.json(
                { error: "targetId, targetType এবং vote আবশ্যক" },
                { status: 400 }
            );
        }

        if (!["iftar", "tarabi"].includes(targetType)) {
            return NextResponse.json(
                { error: 'targetType "iftar" বা "tarabi" হতে হবে' },
                { status: 400 }
            );
        }

        if (!["fact", "fake"].includes(vote)) {
            return NextResponse.json(
                { error: 'ভোট "fact" বা "fake" হতে হবে' },
                { status: 400 }
            );
        }

        await connectDB();

        const Model = targetType === "iftar" ? IftarUpdate : TarabiUpdate;
        const doc = await Model.findById(targetId);

        if (!doc) {
            return NextResponse.json({ error: "আপডেট খুঁজে পাওয়া যায়নি" }, { status: 404 });
        }

        // ইতিমধ্যে ভোট দিয়েছেন কিনা চেক
        const alreadyVoted = doc.voters.some(
            (v) => v.deviceId === deviceId || v.ip === ip
        );

        if (alreadyVoted) {
            return NextResponse.json(
                { error: "আপনি ইতিমধ্যে এই আপডেটে ভোট দিয়েছেন।" },
                { status: 409 }
            );
        }

        // ভোট যোগ
        doc.voters.push({ deviceId, ip, vote });

        if (vote === "fact") {
            doc.factVotes += 1;
        } else {
            doc.fakeVotes += 1;
        }

        // ৫টি ভুয়া ভোটে স্বয়ংক্রিয় লুকানো
        if (doc.fakeVotes >= 5) {
            doc.hidden = true;
        }

        await doc.save();

        return NextResponse.json({
            message: `"${vote === "fact" ? "সত্য" : "ভুয়া"}" ভোট সফলভাবে রেকর্ড হয়েছে`,
            factVotes: doc.factVotes,
            fakeVotes: doc.fakeVotes,
            hidden: doc.hidden,
        });
    } catch (error) {
        console.error("POST /api/vote error:", error);
        return NextResponse.json({ error: "ভোট দিতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
