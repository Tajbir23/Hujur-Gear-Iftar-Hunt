import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }, // bcrypt hashed
    },
    { timestamps: true }
);

// Password hash করার আগে
AdminUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password verify করার method
AdminUserSchema.methods.verifyPassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

const AdminUser =
    mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

export default AdminUser;
