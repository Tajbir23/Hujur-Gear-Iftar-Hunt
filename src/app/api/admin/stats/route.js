import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Mosque from "@/lib/models/Mosque";
import IftarUpdate from "@/lib/models/IftarUpdate";
import TarabiUpdate from "@/lib/models/TarabiUpdate";

export async function GET() {
    try {
        await connectDB();

        const [mosqueCount, iftarCount, tarabiCount, recentMosques, recentIftarUpdates] =
            await Promise.all([
                Mosque.countDocuments(),
                IftarUpdate.countDocuments(),
                TarabiUpdate.countDocuments(),
                Mosque.find().sort({ createdAt: -1 }).limit(5).lean(),
                IftarUpdate.find().sort({ createdAt: -1 }).limit(5)
                    .populate("mosqueId", "name").lean(),
            ]);

        const mem = process.memoryUsage();
        const uptimeSeconds = process.uptime();

        return NextResponse.json({
            db: { mosqueCount, iftarCount, tarabiCount },
            memory: {
                heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
                heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
                rssMB: Math.round(mem.rss / 1024 / 1024),
            },
            uptime: {
                seconds: Math.floor(uptimeSeconds),
                formatted: formatUptime(uptimeSeconds),
            },
            recent: { mosques: recentMosques, iftarUpdates: recentIftarUpdates },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}
