import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Report from "@/lib/models/Report";
import { headers } from "next/headers";

export async function POST(req) {
    try {
        await connectDB();

        const data = await req.json();

        // Basic validation
        if (!data.message || !data.type) {
            return NextResponse.json(
                { error: "Message and type are required" },
                { status: 400 }
            );
        }

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";

        const newReport = await Report.create({
            message: data.message,
            type: data.type,
            contactInfo: data.contactInfo || "",
            deviceId: data.deviceId || "unknown",
            ip,
        });

        return NextResponse.json(
            { success: true, report: newReport },
            { status: 201 }
        );
    } catch (error) {
        console.error("Report POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
