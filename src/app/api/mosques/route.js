import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Mosque from "@/lib/models/Mosque";
import { getClientIp, getDeviceId, checkRateLimit } from "@/lib/utils/fingerprint";

/**
 * GET /api/mosques?lat=23.8&lng=90.4&radius=5000
 * কাছাকাছি মসজিদ খুঁজুন (geospatial query)
 */
export async function GET(request) {
    try {
        await connectDB();

        // সব মসজিদ (সর্বশেষ যোগ করাগুলো আগে) 
        // আপনি চাইলে ৫০০ লিমিট রাখতে পারেন
        const mosques = await Mosque.find({})
            .sort({ createdAt: -1 })
            .lean()
            .limit(500);

        return NextResponse.json({ mosques });
    } catch (error) {
        console.error("GET /api/mosques error:", error);
        return NextResponse.json({ error: "মসজিদ লোড করতে সমস্যা হয়েছে" }, { status: 500 });
    }
}

/**
 * POST /api/mosques
 * নতুন মসজিদ যোগ করুন
 */
export async function POST(request) {
    try {
        const deviceId = getDeviceId(request);
        if (!deviceId) {
            return NextResponse.json(
                { error: "ডিভাইস আইডি প্রয়োজন। অনুগ্রহ করে কুকি চালু করুন।" },
                { status: 400 }
            );
        }

        const ip = await getClientIp();
        const body = await request.json();
        const { name, lat, lng, address, facilities } = body;

        if (!name) {
            return NextResponse.json(
                { error: "মসজিদের নাম আবশ্যক" },
                { status: 400 }
            );
        }

        const hasCoords = lat !== undefined && lat !== null && lng !== undefined && lng !== null;

        if (hasCoords && (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)))) {
            return NextResponse.json(
                { error: "সঠিক অক্ষাংশ ও দ্রাঘিমাংশ দিন" },
                { status: 400 }
            );
        }

        if (!hasCoords && !address?.trim()) {
            return NextResponse.json(
                { error: "কোঅর্ডিনেট অথবা ঠিকানা অন্তত একটি দিতে হবে" },
                { status: 400 }
            );
        }

        await connectDB();

        // রেট লিমিট: প্রতিদিন সর্বোচ্চ ২টি মসজিদ যোগ করা যাবে
        const { allowed } = await checkRateLimit(Mosque, deviceId, ip, 2);
        if (!allowed) {
            return NextResponse.json(
                { error: "আপনি আজকে সর্বোচ্চ ২টি মসজিদ যোগ করেছেন।" },
                { status: 429 }
            );
        }

        // ১০০ মিটারের মধ্যে ডুপ্লিকেট মসজিদ চেক (শুধু কোঅর্ডিনেট থাকলে)
        if (hasCoords) {
            const nearby = await Mosque.findOne({
                location: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)],
                        },
                        $maxDistance: 100,
                    },
                },
            }).lean();

            if (nearby) {
                return NextResponse.json(
                    { error: `"${nearby.name}" নামের একটি মসজিদ ইতিমধ্যে এই এলাকায় (১০০ মি.) আছে।` },
                    { status: 409 }
                );
            }
        }

        const mosqueData = {
            name: name.trim(),
            address: address?.trim() || "",
            facilities: facilities || [],
            addedBy: deviceId,
            addedByIp: ip,
        };

        if (hasCoords) {
            mosqueData.location = {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)],
            };
        }

        const mosque = await Mosque.create(mosqueData);

        return NextResponse.json({ mosque, message: "মসজিদ সফলভাবে যোগ হয়েছে!" }, { status: 201 });
    } catch (error) {
        console.error("POST /api/mosques error:", error);
        return NextResponse.json({ error: "মসজিদ যোগ করতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
