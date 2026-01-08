"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/**
 * Finance Page (Protected)
 * Allows users to enter monthly finance data and view their existing records.
 */

// Validation schema matching the API
const financeSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format (e.g., 2026-01)"),
  income: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Income must be a positive number",
  }),
  expense: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Expense must be a positive number",
  }),
});

type FinanceFormData = z.infer<typeof financeSchema>;

interface FinanceRecord {
  id: string;
  month: string;
  income: number;
  expense: number;
  debt: number;
  createdAt: string;
}

export default function FinancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [isFetchingRecords, setIsFetchingRecords] = useState(true);

  // Initialize React Hook Form with Zod validation
  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      month: "",
      income: "",
      expense: "",
    },
  });

  // Fetch existing finance records on mount when the page is loaded
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecords() {
    setIsFetchingRecords(true);
    try {
      const response = await fetch("/api/finance");

      if (response.status === 401) {
        // Not authenticated, redirect to login
        router.push("/login");
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch records");
        return;
      }

      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsFetchingRecords(false);
    }
  }

  // Handle form submission
  async function onSubmit(data: FinanceFormData) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Call the finance API
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: data.month,
          income: Number(data.income),
          expense: Number(data.expense),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to save finance record.");
        setIsLoading(false);
        return;
      }

      // Success: reset form and refresh records
      setSuccessMessage("Finance record saved successfully!");
      form.reset();
      await fetchRecords();
      setIsLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Finance submission error:", error);
      setErrorMessage("Network error. Please check your connection.");
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Episode 9</p>
          <h1 className="text-3xl font-semibold text-foreground">
            Finance Records
          </h1>
        </div>
        <a href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </a>
      </div>

      {/* Finance Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Monthly Finance Data</CardTitle>
          <CardDescription>
            Enter your income and expenses for a specific month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Month Field */}
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="2026-01"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Income Field */}
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        step="0.01"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expense Field */}
              <FormField
                control={form.control}
                name="expense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3000"
                        step="0.01"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                onClick={() => console.log("RECORDS FROM API:", records)}
              >
                {isLoading ? "Saving..." : "Save Record"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Records */}
      <Card>
        <CardHeader>
          <CardTitle>Your Finance Records</CardTitle>
          <CardDescription>
            View all your saved monthly finance data below...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingRecords ? (
            <p className="text-sm text-muted-foreground">Loading records...</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No records yet. Add your first finance record above.
            </p>
          ) : (
            <div className="overflow-x-auto overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Month</th>
                    <th className="pb-2 text-right font-medium">Income</th>
                    <th className="pb-2 text-right font-medium">Expense</th>
                    <th className="pb-2 text-right font-medium">Net</th>
                    <th className="pb-2 text-right font-medium">Debt</th>
                    
                  </tr>
                </thead>
                </table>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              
              <table className="w-full text-sm">
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3">{record.month}</td>
                      <td className="py-3 text-right text-green-600 dark:text-green-400">
                        ${record.income.toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-red-600 dark:text-red-400">
                        ${record.expense.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          record.income - record.expense >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ${(record.income - record.expense).toFixed(2)}
                      </td>
                       <td className={`py-3 text-right 
                            ${  record.debt  <= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                          }`}
                       >

                             {record.debt   }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
