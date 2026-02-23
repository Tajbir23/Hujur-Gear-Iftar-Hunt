import mongoose from "mongoose";

const VoterSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true },
        ip: { type: String, required: true },
        vote: { type: String, enum: ["fact", "fake"], required: true },
    },
    { _id: false }
);

const TarabiUpdateSchema = new mongoose.Schema(
    {
        mosqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mosque",
            required: [true, "Mosque ID is required"],
            index: true,
        },
        startTime: {
            type: String, // "HH:MM" format (24h)
            required: [true, "Start time is required"],
            validate: {
                validator: function (v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: "Start time must be in HH:MM format",
            },
        },
        endTime: {
            type: String, // "HH:MM" format (24h)
            required: [true, "End time is required"],
            validate: {
                validator: function (v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: "End time must be in HH:MM format",
            },
        },
        durationMinutes: {
            type: Number,
            required: true,
        },
        date: {
            type: String, // YYYY-MM-DD
            required: true,
            index: true,
        },
        deviceId: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        factVotes: {
            type: Number,
            default: 0,
        },
        fakeVotes: {
            type: Number,
            default: 0,
        },
        voters: {
            type: [VoterSchema],
            default: [],
        },
        hidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for leaderboard queries
TarabiUpdateSchema.index({ date: 1, durationMinutes: 1, hidden: 1 });
// Compound index for mosque daily lookup
TarabiUpdateSchema.index({ mosqueId: 1, date: 1 });

export default mongoose.models.TarabiUpdate || mongoose.model("TarabiUpdate", TarabiUpdateSchema);
