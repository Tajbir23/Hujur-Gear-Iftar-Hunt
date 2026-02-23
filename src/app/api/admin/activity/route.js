import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Mosque from "@/lib/models/Mosque";
import IftarUpdate from "@/lib/models/IftarUpdate";
import TarabiUpdate from "@/lib/models/TarabiUpdate";
import { cookies } from "next/headers";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/utils/adminAuth";

async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const payload = await verifyAdminToken(token);
    return !!payload;
}

export async function GET(req) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

        const [mosques, iftarUpdates, tarabiUpdates] = await Promise.all([
            Mosque.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .select("name address location addedBy addedByIp facilities verified createdAt")
                .lean(),
            IftarUpdate.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate("mosqueId", "name address")
                .select("mosqueId menu status date deviceId ip factVotes fakeVotes hidden createdAt")
                .lean(),
            TarabiUpdate.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate("mosqueId", "name address")
                .select("mosqueId startTime endTime durationMinutes date deviceId ip factVotes fakeVotes hidden createdAt")
                .lean(),
        ]);

        // Label and merge into one chronological activity feed
        const feed = [
            ...mosques.map((m) => ({
                _id: m._id,
                type: "mosque",
                label: "মসজিদ যোগ",
                name: m.name,
                address: m.address || null,
                hasCoords: !!(m.location?.coordinates?.length === 2),
                coords: m.location?.coordinates || null,
                deviceId: m.addedBy,
                ip: m.addedByIp,
                facilities: m.facilities,
                verified: m.verified,
                createdAt: m.createdAt,
            })),
            ...iftarUpdates.map((u) => ({
                _id: u._id,
                type: "iftar",
                label: "ইফতার আপডেট",
                mosqueName: u.mosqueId?.name || "অজানা মসজিদ",
                mosqueAddress: u.mosqueId?.address || null,
                menu: u.menu,
                status: u.status,
                date: u.date,
                deviceId: u.deviceId,
                ip: u.ip,
                factVotes: u.factVotes,
                fakeVotes: u.fakeVotes,
                hidden: u.hidden,
                createdAt: u.createdAt,
            })),
            ...tarabiUpdates.map((u) => ({
                _id: u._id,
                type: "tarabi",
                label: "তারাবি আপডেট",
                mosqueName: u.mosqueId?.name || "অজানা মসজিদ",
                mosqueAddress: u.mosqueId?.address || null,
                startTime: u.startTime,
                endTime: u.endTime,
                durationMinutes: u.durationMinutes,
                date: u.date,
                deviceId: u.deviceId,
                ip: u.ip,
                factVotes: u.factVotes,
                fakeVotes: u.fakeVotes,
                hidden: u.hidden,
                createdAt: u.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);

        return NextResponse.json({ feed, total: feed.length });
    } catch (error) {
        console.error("Admin Activity GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
