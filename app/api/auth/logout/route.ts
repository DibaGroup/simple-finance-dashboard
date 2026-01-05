import { NextResponse } from "next/server";

/**
 * Logout API Route
 * Clears the authentication cookie to log the user out.
 */
export async function POST() {
    try {
        // Create response
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear the auth-token cookie
        response.cookies.set("auth-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0, // Expire immediately
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error during logout" },
            { status: 500 }
        );
    }
}
