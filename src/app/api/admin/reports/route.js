import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/lib/models/Report";
import { cookies } from "next/headers";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/utils/adminAuth";

// Auth check helper — matches the codebase's jose-based pattern
async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const payload = await verifyAdminToken(token);
    return !!payload;
}

export async function GET() {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Fetch reports sorted by status (Pending first) and then newest first
        const reports = await Report.find()
            .sort({ status: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({ reports });
    } catch (error) {
        console.error("Admin Reports GET error:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();

        if (!data.id || !data.status) {
            return NextResponse.json({ error: "Report ID and status are required" }, { status: 400 });
        }

        if (!["Pending", "Resolved"].includes(data.status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            data.id,
            { status: data.status },
            { new: true }
        );

        if (!updatedReport) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, report: updatedReport });
    } catch (error) {
        console.error("Admin Reports PATCH error:", error);
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}
