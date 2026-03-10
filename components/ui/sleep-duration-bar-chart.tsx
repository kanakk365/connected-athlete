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

type SleepDataPoint = { date: string; hours: number };

const chartConfig = {
  hours: {
    label: "Sleep Hours",
    color: "#6f73e2",
  },
} satisfies ChartConfig;

export function SleepDurationBarChart({ data }: { data?: SleepDataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep Duration</CardTitle>
        <CardDescription>Daily sleep hours</CardDescription>
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
              <Bar dataKey="hours" fill="var(--color-hours)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

