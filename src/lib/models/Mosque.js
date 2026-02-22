import mongoose from "mongoose";

const MosqueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Mosque name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: [true, "Coordinates are required"],
                validate: {
                    validator: function (coords) {
                        return (
                            coords.length === 2 &&
                            coords[0] >= -180 &&
                            coords[0] <= 180 &&
                            coords[1] >= -90 &&
                            coords[1] <= 90
                        );
                    },
                    message: "Invalid coordinates",
                },
            },
        },
        address: {
            type: String,
            trim: true,
            maxlength: [200, "Address cannot exceed 200 characters"],
            default: "",
        },
        facilities: {
            type: [String],
            enum: ["AC Available", "Good Fan Coverage", "Suffocating", "Parking", "Wudu Area", "Women Section"],
            default: [],
        },
        addedBy: {
            type: String, // Device fingerprint UUID
            required: true,
        },
        addedByIp: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// 2dsphere index for geospatial queries
MosqueSchema.index({ location: "2dsphere" });

// Text index for search
MosqueSchema.index({ name: "text", address: "text" });

export default mongoose.models.Mosque || mongoose.model("Mosque", MosqueSchema);
