"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

type DistanceDataPoint = { date: string; distance: number };

const chartConfig = {
  distance: {
    label: "Distance",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

export function DistanceLineChart({ data }: { data?: DistanceDataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance Trend</CardTitle>
        <CardDescription>Daily distance traveled</CardDescription>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={formattedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="distance"
                type="linear"
                stroke="var(--color-distance)"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

