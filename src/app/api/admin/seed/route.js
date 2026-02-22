import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser";

// POST /api/admin/seed — admin user তৈরি করে (একবার চালালেই হয়)
export async function POST(request) {
    try {
        const { secret } = await request.json();
        if (secret !== (process.env.ADMIN_SEED_SECRET || "seed-ramadan-2026")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const exists = await AdminUser.findOne({ username: "tajbir23" });
        if (exists) {
            return NextResponse.json({ message: "Admin user already exists" });
        }

        const admin = await AdminUser.create({
            username: "tajbir23",
            password: "201102918a@A", // pre-save hook এ hash হবে
        });

        return NextResponse.json({ success: true, message: "Admin user created!", username: admin.username });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}
