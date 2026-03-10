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

type ActiveZoneMinutesDataPoint = { date: string; minutes: number };

const chartConfig = {
  minutes: {
    label: "Active Zone Minutes",
    color: "#a5b4fc", // Pastel Indigo
  },
} satisfies ChartConfig;

export function ActiveZoneMinutesBarChart({ data }: { data?: ActiveZoneMinutesDataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Zone Minutes</CardTitle>
        <CardDescription>Daily active zone minutes</CardDescription>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
              <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

