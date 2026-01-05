import { Schema, model, models, type Document } from "mongoose";

/**
 * User model for authentication.
 * Stores email (unique) and hashed password for login.
 */

//این فقط برای TypeScript هست
//📌 روی دیتابیس هیچ اثری نداره

export interface IUser extends Document {
    email: string;
    password: string; // Hashed password (never store plaintext)
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Prevent duplicate model compilation in development hot-reload
const User = models.User || model<IUser>("User", UserSchema);

export default User;
