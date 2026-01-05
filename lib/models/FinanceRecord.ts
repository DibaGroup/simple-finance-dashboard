import mongoose, { Schema, model, models, type Document } from "mongoose";

/**
 * FinanceRecord model for storing monthly financial data.
 * Each record is linked to a user and tracks income and expenses for a specific month.
 */

export interface IFinanceRecord extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the User who owns this record
    month: string; // e.g., "2026-01" for January 2026
    income: number; // Monthly income amount
    expense: number; // Monthly expense amount
    debt?: number; // My new adding testing
    createdAt: Date;
}

const FinanceRecordSchema = new Schema<IFinanceRecord>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        month: {
            type: String,
            required: [true, "Month is required"],
            trim: true,
            // Expected format: YYYY-MM (e.g., "2026-01")
        },
        income: {
            type: Number,
            required: [true, "Income is required"],
            min: [0, "Income cannot be negative"],
            default: 0,
        },
        expense: {
            type: Number,
            required: [true, "Expense is required"],
            min: [0, "Expense cannot be negative"],
            default: 0,
        },
        debt: {
            type: Number,
          //  required: false,
            min: [0, "Debt cannot be negative"],
            default: 0,
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
const FinanceRecord =
    models.FinanceRecord || model<IFinanceRecord>("FinanceRecord", FinanceRecordSchema);

export default FinanceRecord;
