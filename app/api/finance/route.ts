import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import FinanceRecord from "@/lib/models/FinanceRecord";
import { getCurrentUser } from "@/lib/auth";

/**
 * Finance API Routes
 * POST: Create a new finance record for the authenticated user
 * GET: Fetch all finance records for the authenticated user
 */

// Validation schema for finance record
const financeSchema = z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
    income: z.number().min(0, "Income cannot be negative"),
    expense: z.number().min(0, "Expense cannot be negative"),
});

export async function POST(request: Request) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validationResult = financeSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { month, income, expense } = validationResult.data;

        // Connect to MongoDB
        await connectToDatabase();

        // Check if record already exists for this user and month
        const existingRecord = await FinanceRecord.findOne({
            userId: user.userId,
            month,
        });

        if (existingRecord) {
            return NextResponse.json(
                { error: "A record for this month already exists. Please update or delete it first." },
                { status: 409 }
            );
        }

 const debt = expense > income ? expense - income : 0;
        // Calculate remaining balance after the transaction

        // Create new finance record and save to database
        const newRecord = await FinanceRecord.create({
            userId: user.userId,
            month,
            income,
            expense,
            debt,

        });
// Respond with the created record
        return NextResponse.json(
            {
                message: "Finance record created successfully",
                record: {
                    id: newRecord._id,
                    month: newRecord.month,
                    income: newRecord.income,
                    expense: newRecord.expense,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Finance POST error:", error);
        return NextResponse.json(
            { error: "Internal server error while saving finance record" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try     {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        // Connect to MongoDB
        await connectToDatabase();

        // Fetch all finance records for this user, sorted by month descending
        const records = await FinanceRecord.find({ userId: user.userId })
            .sort({ month: -1 })
            .lean();

// 🔍 گزارش بدهکارها
const debtRecords = records.filter((record) => record.debt > 0);





console.log("⚠️ User Debt Report:");
debtRecords.forEach((record) => {
  console.log(
    `Month: ${record.month} | Income: ${record.income} | Expense: ${record.expense} | Debt: ${record.debt}`
  );
});

// ✅ حالا پاسخ به کلاینت

        return NextResponse.json(
            {
                records: records.map((record) => ({
                    id: record._id.toString(),
                    month: record.month,
                    income: record.income,
                    expense: record.expense,
                    debt: record.debt,
                    createdAt: record.createdAt,
                })),
            },
            { status: 200 }
        );
        





    } catch (error) {
        console.error("Finance GET error:", error);
        return NextResponse.json(
            { error: "Internal server error while fetching finance records" },
            { status: 500 }
        );
    }
}
