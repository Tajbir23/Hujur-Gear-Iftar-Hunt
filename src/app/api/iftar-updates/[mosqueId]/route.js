import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import IftarUpdate from "@/lib/models/IftarUpdate";
import { getTodayDate } from "@/lib/utils/fingerprint";

/**
 * GET /api/iftar-updates/[mosqueId]
 * নির্দিষ্ট মসজিদের আজকের ইফতার আপডেট দেখুন
 */
export async function GET(request, { params }) {
    try {
        const { mosqueId } = await params;

        if (!mosqueId) {
            return NextResponse.json({ error: "মসজিদ আইডি আবশ্যক" }, { status: 400 });
        }

        const today = getTodayDate();

        await connectDB();

        const updates = await IftarUpdate.find({
            mosqueId,
            date: today,
            hidden: false,
        })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ updates });
    } catch (error) {
        console.error("GET /api/iftar-updates error:", error);
        return NextResponse.json({ error: "ইফতার আপডেট লোড করতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
