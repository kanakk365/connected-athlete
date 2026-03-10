"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type CaloriesDataPoint = { date: string; calories: number };

const chartConfig = {
  calories: {
    label: "Calories",
    color: "#dc767c",
  },
} satisfies ChartConfig;

export function CaloriesBarChart({ data }: { data?: CaloriesDataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories Burned</CardTitle>
        <CardDescription>Daily calories burned</CardDescription>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={formattedData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="calories" fill="var(--color-calories)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

