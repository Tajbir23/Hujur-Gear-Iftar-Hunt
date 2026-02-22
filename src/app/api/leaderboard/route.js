import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TarabiUpdate from "@/lib/models/TarabiUpdate";
import { getTodayDate } from "@/lib/utils/fingerprint";

/**
 * GET /api/leaderboard
 * রকেট হুজুর লিডারবোর্ড — সবচেয়ে দ্রুত তারাবি অনুযায়ী র‍্যাংকিং
 */
export async function GET() {
    try {
        const today = getTodayDate();

        await connectDB();

        const leaderboard = await TarabiUpdate.aggregate([
            {
                $match: {
                    date: today,
                    hidden: false,
                },
            },
            {
                $sort: { factVotes: -1 },
            },
            {
                $group: {
                    _id: "$mosqueId",
                    startTime: { $first: "$startTime" },
                    endTime: { $first: "$endTime" },
                    durationMinutes: { $first: "$durationMinutes" },
                    factVotes: { $first: "$factVotes" },
                    fakeVotes: { $first: "$fakeVotes" },
                    updateId: { $first: "$_id" },
                },
            },
            {
                $sort: { durationMinutes: 1 },
            },
            {
                $lookup: {
                    from: "mosques",
                    localField: "_id",
                    foreignField: "_id",
                    as: "mosque",
                },
            },
            {
                $unwind: "$mosque",
            },
            {
                $project: {
                    _id: "$updateId",
                    mosqueId: "$_id",
                    mosqueName: "$mosque.name",
                    mosqueAddress: "$mosque.address",
                    mosqueLocation: "$mosque.location",
                    facilities: "$mosque.facilities",
                    startTime: 1,
                    endTime: 1,
                    durationMinutes: 1,
                    factVotes: 1,
                    fakeVotes: 1,
                },
            },
            {
                $limit: 50,
            },
        ]);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("GET /api/leaderboard error:", error);
        return NextResponse.json({ error: "লিডারবোর্ড লোড করতে সমস্যা হয়েছে" }, { status: 500 });
    }
}
