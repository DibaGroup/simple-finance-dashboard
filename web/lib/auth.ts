import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * Authentication helper utilities.
 * Provides functions to verify JWT tokens and get current user information.
 */

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

/**
 * Get the current authenticated user from the JWT cookie.
 * Returns user data if valid, or null if not authenticated.
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token");
        //کوکی فقط روی سرور خونده می‌شه

        if (!token) {
            return null;
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token.value, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error("Auth verification error:", error);
        return null;
    }
}

/**
 * Require authentication for a page.
 * Throws an error if user is not authenticated (useful for server components).
 */
export async function requireAuth(): Promise<JWTPayload> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized: Please log in to access this page.");
    }

    return user;
}
