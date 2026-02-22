import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "ramadan-radar-admin-secret-2026"
);

export const COOKIE_NAME = "admin_token";

export async function signAdminToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(SECRET);
}

export async function verifyAdminToken(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch {
        return null;
    }
}
