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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type BodyMetricsDataPoint = { 
  date: string; 
  weight?: number; 
  bmi?: number; 
  bodyFat?: number;
};

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "#f59e0b",
  },
  bmi: {
    label: "BMI",
    color: "#547aff",
  },
  bodyFat: {
    label: "Body Fat (%)",
    color: "#6f73e2",
  },
} satisfies ChartConfig;

export function BodyMetricsLineChart({ data }: { data?: BodyMetricsDataPoint[] }) {
  const formattedData = data && data.length > 0 ? data : [];
  const hasMultipleMetrics = formattedData.some(d => 
    (d.weight !== undefined && d.weight !== null) || 
    (d.bmi !== undefined && d.bmi !== null) || 
    (d.bodyFat !== undefined && d.bodyFat !== null)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
        <CardDescription>Weight, BMI, and Body Fat trends</CardDescription>
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
                content={<ChartTooltipContent />}
              />
              {hasMultipleMetrics && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              <Line
                dataKey="weight"
                type="linear"
                stroke="var(--color-weight)"
                dot={false}
                strokeWidth={2}
              />
              <Line
                dataKey="bmi"
                type="linear"
                stroke="var(--color-bmi)"
                dot={false}
                strokeWidth={2}
              />
              <Line
                dataKey="bodyFat"
                type="linear"
                stroke="var(--color-bodyFat)"
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

