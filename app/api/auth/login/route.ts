import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";

/**
 * Login API Route
 * Validates credentials, compares password hash, and issues a JWT token as a cookie.
 */

// Validation schema for login
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// JWT secret from environment (fallback for demo, should always be set in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: Request) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // Connect to MongoDB
        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create JWT token (valid for 7 days)
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Create response with token in httpOnly cookie
        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        // Set JWT as httpOnly cookie for security
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error during login" },
            { status: 500 }
        );
    }
}
