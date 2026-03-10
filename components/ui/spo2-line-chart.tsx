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

type SpO2DataPoint = { date: string; spo2: number };

const chartConfig = {
  spo2: {
    label: "SpO2",
    color: "#10b981",
  },
} satisfies ChartConfig;

export function SpO2LineChart({ data }: { data?: SpO2DataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SpO2 Trend</CardTitle>
        <CardDescription>Average blood oxygen saturation</CardDescription>
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
                dataKey="spo2"
                type="linear"
                stroke="var(--color-spo2)"
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

