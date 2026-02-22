import mongoose from "mongoose";

const VoterSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true },
        ip: { type: String, required: true },
        vote: { type: String, enum: ["fact", "fake"], required: true },
    },
    { _id: false }
);

const IftarUpdateSchema = new mongoose.Schema(
    {
        mosqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mosque",
            required: [true, "Mosque ID is required"],
            index: true,
        },
        menu: {
            type: [String],
            required: [true, "Menu items are required"],
            validate: {
                validator: function (items) {
                    return items.length > 0 && items.length <= 10;
                },
                message: "Menu must have 1-10 items",
            },
        },
        status: {
            type: String,
            enum: ["Food Available", "Very Crowded", "Finished"],
            default: "Food Available",
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

// Compound index for querying today's updates per mosque
IftarUpdateSchema.index({ mosqueId: 1, date: 1 });
// Index for filtering non-hidden updates
IftarUpdateSchema.index({ hidden: 1, date: 1 });

export default mongoose.models.IftarUpdate || mongoose.model("IftarUpdate", IftarUpdateSchema);
