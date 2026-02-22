import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser";
import { signAdminToken, COOKIE_NAME } from "@/lib/utils/adminAuth";

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Username এবং password দিন" }, { status: 400 });
        }

        await connectDB();

        const admin = await AdminUser.findOne({ username: username.toLowerCase() });
        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const valid = await admin.verifyPassword(password);
        if (!valid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signAdminToken({ username: admin.username, id: admin._id.toString() });

        const response = NextResponse.json({ success: true });
        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 12, // 12 ঘণ্টা
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
