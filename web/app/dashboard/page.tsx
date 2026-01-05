import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import FinanceRecord from "@/lib/models/FinanceRecord";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mongoose from "mongoose";
import MonthlyIncomeChart from "@/components/MonthlyIncomeChart";

/**
 * Dashboard Page (Protected)
 * Requires authentication. Shows total users and total finance records.
 */

async function LogoutButton() {
  async function handleLogout() {
    "use server";

    // Call logout API to clear cookie
    await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/auth/logout`,
      {
        method: "POST",
      }
    );

    redirect("/login");
  }

  return (
    <form action={handleLogout}>
      <Button type="submit" variant="outline">
        Log Out
      </Button>
    </form>
  );
}

export default async function DashboardPage() {
  // Check authentication - redirect to login if not authenticated
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Connect to database and fetch metrics
  await connectToDatabase();

  // Get total users count
  const totalUsers = await User.countDocuments();

  // Get total finance records count
  const totalFinanceRecordsOfUser = await FinanceRecord.countDocuments({
    userId: user.userId,
  });

  // Get total income for the user
  const totalIncomeOfUser = await FinanceRecord.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(user.userId) } },
    { $group: { _id: null, totalIncome: { $sum: "$income" } } },
  ]);

  // Get total   expenses for the user
  const totalExpenseOfUser = await FinanceRecord.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(user.userId) } },
    { $group: { _id: null, totalExpense: { $sum: "$expense" } } },
  ]);

  // Get monthly finance records for chart
  const monthlyRecords = await FinanceRecord.find({
    userId: new mongoose.Types.ObjectId(user.userId),
  })
    .select("month income expense")
    .sort({ month: 1 })
    .lean();

  // Format data for chart component
  const chartData = monthlyRecords.map((record) => ({
    month: record.month,
    income: record.income,
    expense: record.expense,
  }));

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Episode 8</p>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        </div>
        <LogoutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, User: {user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View summary statistics for your finance dashboard below.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users in the system
            </p>
          </CardContent>
        </Card>

        {/* Total Finance Records Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Your Finance Records
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFinanceRecordsOfUser}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly financial records stored..
            </p>
          </CardContent>
        </Card>
        {/* Total Finance Records Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Your Income
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIncomeOfUser[0]?.totalIncome || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly financial records stored..
            </p>
          </CardContent>
        </Card>
        {/* Total Finance Records Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Your Expense Records
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenseOfUser[0]?.totalExpense || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly financial records stored..
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Income Chart */}
      <MonthlyIncomeChart data={chartData} />

      <div className="flex gap-4">
        <a href="/finance">
          <Button>Go to Finance Records</Button>
        </a>
      </div>
    </main>
  );
}
