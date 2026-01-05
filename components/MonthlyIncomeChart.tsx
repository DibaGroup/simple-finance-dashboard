"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FinanceData {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyIncomeChartProps {
  data: FinanceData[];
}

export default function MonthlyIncomeChart({ data }: MonthlyIncomeChartProps) {
  // Sort data by month
  const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

  // Format month for display (YYYY-MM to MMM YYYY)
  const formattedData = sortedData.map((item) => {
    const [year, month] = item.month.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    return {
      ...item,
      displayMonth: `${monthName} ${year}`,
    };
  });

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Monthly Income Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis
              dataKey="displayMonth"
              tick={{ fontSize: 8 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              name="Income"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              name="Expense"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
