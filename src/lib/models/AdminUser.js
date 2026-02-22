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
AdminUserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Password verify করার method
AdminUserSchema.methods.verifyPassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

const AdminUser =
    mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

export default AdminUser;
