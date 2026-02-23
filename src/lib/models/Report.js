import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: [true, "Report message is required"],
            maxlength: [1000, "Message cannot exceed 1000 characters"],
        },
        type: {
            type: String,
            enum: ["Bug", "Feedback", "Other"],
            required: [true, "Report type is required"],
        },
        contactInfo: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Pending", "Resolved"],
            default: "Pending",
        },
        deviceId: {
            type: String,
        },
        ip: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

// Index to easily fetch pending reports first
ReportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
