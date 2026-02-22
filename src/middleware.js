import { NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/utils/adminAuth";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        const payload = token ? await verifyAdminToken(token) : null;

        if (!payload) {
            // 404 দেখাও — route exist করে বোঝা যাবে না
            return new NextResponse(null, { status: 404 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
