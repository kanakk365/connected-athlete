"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarDefault } from "@/components/ui/bar-chart";
import { ChartPieDonut } from "@/components/ui/pie-chart";
import { HeartRateLineChart } from "@/components/ui/heart-rate-line-chart";
import { WeightLineChart } from "@/components/ui/weight-line-chart";
import { SleepDurationBarChart } from "@/components/ui/sleep-duration-bar-chart";
import { CaloriesBarChart } from "@/components/ui/calories-bar-chart";
import { DistanceLineChart } from "@/components/ui/distance-line-chart";
import { ActiveZoneMinutesBarChart } from "@/components/ui/active-zone-minutes-bar-chart";
import { SpO2LineChart } from "@/components/ui/spo2-line-chart";
import { BodyMetricsLineChart } from "@/components/ui/body-metrics-line-chart";
import DateRangeFilter from "@/components/date-range-filter";
import ReadinessScores from "@/components/readiness-scores";
import SleepInsights from "@/components/sleep-insights";
import NutritionDashboard from "@/components/nutrition-dashboard";
import Layout from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityFeed from "@/components/activity-feed";
import StressInsights from "@/components/stress-insights";
import AdvancedVitals from "@/components/advanced-vitals";
import type {
  DailyData,
  SleepData,
  BodyData,
  NutritionData,
  ActivityData,
  ConnectedDevice,
  ParsedReadiness,
  ParsedSleepInsights,
  ParsedNutrition,
  ParsedActivity,
  ParsedBodyMetrics,
} from "@/lib/terra/types";
import {
  parseDailyMetrics,
  parseDailyMetricsAvg,
  parseSleepBreakdown,
  parseSleepAvgHours,
  parseBodyMetrics,
  parseDailyTimeSeries,
  parseSleepTimeSeries,
  parseReadiness,
  parseSleepInsights,
  parseNutrition,
  parseActivityFeed,
  activityToDailyFallback,
} from "@/lib/terra/parse";

type MetricCard = {
  title: string;
  value: string;
  unit: string;
  image: string;
  color: string;
};

function getDateRange(range: string): { start: string; end: string } {
  const now = new Date();
  // Terra's end_date is exclusive, so use tomorrow to include today's data
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const end = tomorrow.toISOString().split("T")[0];
  let daysBack = 7;
  switch (range) {
    case "today":
      daysBack = 0;
      break;
    case "7d":
      daysBack = 7;
      break;
    case "28d":
      daysBack = 28;
      break;
  }
  const start =
    daysBack === 0
      ? now.toISOString().split("T")[0]
      : new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
  return { start, end };
}

const defaultMetrics: MetricCard[] = [
  {
    title: "Calories",
    value: "—",
    unit: "Kcal",
    image: "/calories.png",
    color: "#dc767c",
  },
  {
    title: "Step Count",
    value: "—",
    unit: "Steps",
    image: "/step.png",
    color: "#547aff",
  },
  {
    title: "Sleep",
    value: "—",
    unit: "Hours",
    image: "/sleep.png",
    color: "#6f73e2",
  },
  {
    title: "Heart Rate",
    value: "—",
    unit: "BPM",
    image: "/heart.png",
    color: "#9161ff",
  },
  {
    title: "Weight",
    value: "—",
    unit: "kg",
    image: "/heart.png",
    color: "#6366f1",
  },
  {
    title: "SpO2",
    value: "—",
    unit: "%",
    image: "/heart.png",
    color: "#06b6d4",
  },
  {
    title: "Temperature",
    value: "—",
    unit: "°C",
    image: "/heart.png",
    color: "#ec4899",
  },
  {
    title: "Distance",
    value: "—",
    unit: "km",
    image: "/step.png",
    color: "#8b5cf6",
  },
];

export default function DevicePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<ConnectedDevice | null>(null);
  const [dateRange, setDateRange] = useState("7d");
  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);

  // Chart data
  const [weeklySteps, setWeeklySteps] = useState<
    Array<{ day: string; steps: number }>
  >([]);
  const [sleepDonut, setSleepDonut] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const [heartRateData, setHeartRateData] = useState<
    Array<{ date: string; heartRate: number }>
  >([]);
  const [weightData, setWeightData] = useState<
    Array<{ date: string; weight: number }>
  >([]);
  const [sleepData, setSleepData] = useState<
    Array<{ date: string; hours: number }>
  >([]);
  const [caloriesData, setCaloriesData] = useState<
    Array<{ date: string; calories: number }>
  >([]);
  const [distanceData, setDistanceData] = useState<
    Array<{ date: string; distance: number }>
  >([]);
  const [activeZoneMinutesData, setActiveZoneMinutesData] = useState<
    Array<{ date: string; minutes: number }>
  >([]);
  const [spo2Data, setSpo2Data] = useState<
    Array<{ date: string; spo2: number }>
  >([]);
  const [bodyMetricsData, setBodyMetricsData] = useState<
    Array<{ date: string; weight?: number; bmi?: number; bodyFat?: number }>
  >([]);

  // New feature states
  const [readiness, setReadiness] = useState<ParsedReadiness | null>(null);
  const [sleepInsightsData, setSleepInsightsData] =
    useState<ParsedSleepInsights | null>(null);
  const [nutrition, setNutrition] = useState<ParsedNutrition | null>(null);
  const [activityFeed, setActivityFeed] = useState<ParsedActivity[]>([]);
  const [advancedBody, setAdvancedBody] = useState<ParsedBodyMetrics | null>(
    null,
  );

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch device info
      const usersRes = await fetch("/api/terra/users");
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];
      const found = users.find(
        (u: {
          user_id: string;
          provider: string;
          active: boolean;
          reference_id?: string;
          last_webhook_update?: string;
        }) => u.user_id === userId,
      );
      if (found) {
        setDevice({
          userId: found.user_id,
          provider: found.provider,
          active: found.active,
          referenceId: found.reference_id,
          lastWebhookUpdate: found.last_webhook_update,
        });
      }

      // 2. Compute date range
      const { start, end } = getDateRange(dateRange);
      const dateParams = `&start_date=${start}&end_date=${end}`;

      // 3. Fetch all data types
      const [dailyRes, sleepRes, bodyRes, nutritionRes, activityRes] =
        await Promise.all([
          fetch(`/api/terra/data?user_id=${userId}&type=daily${dateParams}`),
          fetch(`/api/terra/data?user_id=${userId}&type=sleep${dateParams}`),
          fetch(`/api/terra/data?user_id=${userId}&type=body${dateParams}`),
          fetch(
            `/api/terra/data?user_id=${userId}&type=nutrition${dateParams}`,
          ),
          fetch(`/api/terra/data?user_id=${userId}&type=activity${dateParams}`),
        ]);

      const dailyJson = await dailyRes.json();
      const sleepJson = await sleepRes.json();
      const bodyJson = await bodyRes.json();
      const nutritionJson = await nutritionRes.json();
      const activityJson = await activityRes.json();

      let dailyArr: DailyData[] = dailyJson.data || [];
      const sleepArr: SleepData[] = sleepJson.data || [];
      const bodyArr: BodyData[] = bodyJson.data || [];
      const nutritionArr: NutritionData[] = nutritionJson.data || [];
      const activityArr: ActivityData[] = activityJson.data || [];

      // 3.5 Fallback for individual device
      if (dailyArr.length === 0 && activityArr.length > 0) {
        console.log(
          `No daily data found for ${userId}, using ${activityArr.length} activity session(s) as fallback`,
        );
        dailyArr = activityToDailyFallback(activityArr);
      }

      // 4. Parse top-level metrics
      const isToday = dateRange === "today";
      const dailyMetrics = isToday
        ? parseDailyMetrics(dailyArr)
        : parseDailyMetricsAvg(dailyArr);
      const sleepBreakdown = parseSleepBreakdown(sleepArr);
      const sleepHours = isToday
        ? sleepBreakdown.totalHours
        : parseSleepAvgHours(sleepArr);
      const bodyMetricsParsed = parseBodyMetrics(bodyArr);
      const prefix = isToday ? "" : "Avg ";

      // 5. Parse new features
      setReadiness(parseReadiness(dailyArr));
      setSleepInsightsData(parseSleepInsights(sleepArr));
      setNutrition(parseNutrition(nutritionArr));
      setCaloriesBurned(dailyMetrics.calories);
      setActivityFeed(parseActivityFeed(activityArr));
      setAdvancedBody(bodyMetricsParsed);

      setMetrics([
        {
          title: `${prefix}Calories`,
          value: dailyMetrics.calories?.toLocaleString() ?? "—",
          unit: "Kcal",
          image: "/calories.png",
          color: "#dc767c",
        },
        {
          title: `${prefix}Step Count`,
          value: dailyMetrics.steps?.toLocaleString() ?? "—",
          unit: "Steps",
          image: "/step.png",
          color: "#547aff",
        },
        {
          title: `${prefix}Sleep`,
          value: sleepHours > 0 ? sleepHours.toFixed(1) : "—",
          unit: "Hours",
          image: "/sleep.png",
          color: "#6f73e2",
        },
        {
          title: `${prefix}Heart Rate`,
          value: dailyMetrics.heartRate?.toString() ?? "—",
          unit: "BPM",
          image: "/heart.png",
          color: "#9161ff",
        },
        {
          title: `${prefix}Weight`,
          value: bodyMetricsParsed.weight?.toFixed(1) ?? "—",
          unit: "kg",
          image: "/heart.png",
          color: "#6366f1",
        },
        {
          title: `${prefix}SpO2`,
          value: dailyMetrics.spo2?.toFixed(1) ?? "—",
          unit: "%",
          image: "/heart.png",
          color: "#06b6d4",
        },
        {
          title: `${prefix}Temperature`,
          value: bodyMetricsParsed.temperature?.toFixed(1) ?? "—",
          unit: "°C",
          image: "/heart.png",
          color: "#ec4899",
        },
        {
          title: `${prefix}Distance`,
          value: dailyMetrics.distance?.toFixed(2) ?? "—",
          unit: "km",
          image: "/step.png",
          color: "#8b5cf6",
        },
      ]);

      // 6. Parse chart data
      const dailyTimeSeries = parseDailyTimeSeries(dailyArr);
      const sleepTimeSeries = parseSleepTimeSeries(sleepArr);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      setWeeklySteps(
        dailyTimeSeries.map((d) => ({
          day: days[new Date(d.date).getDay()] || d.date,
          steps: d.steps,
        })),
      );
      setSleepDonut([
        {
          name: "Deep Sleep",
          value: sleepBreakdown.deepHours,
          fill: "#6366f1",
        },
        {
          name: "Light Sleep",
          value: sleepBreakdown.lightHours,
          fill: "#ec4899",
        },
        { name: "REM Sleep", value: sleepBreakdown.remHours, fill: "#8b5cf6" },
        { name: "Awake", value: sleepBreakdown.awakeHours, fill: "#a78bfa" },
      ]);
      setHeartRateData(
        dailyTimeSeries
          .filter((d) => d.heartRate !== null)
          .map((d) => ({ date: d.date, heartRate: d.heartRate! })),
      );
      setCaloriesData(
        dailyTimeSeries.map((d) => ({ date: d.date, calories: d.calories })),
      );
      setDistanceData(
        dailyTimeSeries.map((d) => ({ date: d.date, distance: d.distance })),
      );
      setActiveZoneMinutesData(
        dailyTimeSeries.map((d) => ({
          date: d.date,
          minutes: d.activeMinutes,
        })),
      );
      setSpo2Data(
        dailyTimeSeries
          .filter((d) => d.spo2 !== null)
          .map((d) => ({ date: d.date, spo2: d.spo2! })),
      );
      setSleepData(sleepTimeSeries);

      if (bodyArr.length > 0) {
        const bm = bodyArr
          .map((b) => {
            const m = b.measurements_data?.measurements?.[0];
            if (!m) return null;
            return {
              date: new Date(b.metadata.start_time).toLocaleDateString(
                undefined,
                { month: "short", day: "numeric" },
              ),
              weight: m.weight_kg,
              bmi: m.BMI,
              bodyFat: m.body_fat_percentage,
            };
          })
          .filter(Boolean) as Array<{
          date: string;
          weight?: number;
          bmi?: number;
          bodyFat?: number;
        }>;
        setBodyMetricsData(bm);
        setWeightData(
          bm
            .filter((b) => b.weight)
            .map((b) => ({ date: b.date, weight: b.weight! })),
        );
      }
    } catch (err: unknown) {
      console.error("Error fetching device data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load device data",
      );
    } finally {
      setLoading(false);
    }
  }, [userId, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h2 className="text-2xl font-bold text-foreground mt-1">
              {device ? `${device.provider} Device` : "Device Details"}
            </h2>
            {device && (
              <p className="text-sm text-muted-foreground">
                User ID: {device.userId} • Status:{" "}
                {device.active ? "Active" : "Inactive"}
                {device.lastWebhookUpdate &&
                  ` • Last update: ${new Date(device.lastWebhookUpdate).toLocaleString()}`}
              </p>
            )}
          </div>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Skeleton className="h-[120px] w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 mt-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        )}

        {!loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-full space-y-12">
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {metrics.map(({ title, value, unit, image, color }) => (
                    <Card
                      key={title}
                      className="relative overflow-hidden border-0 p-0 text-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-300 rounded-2xl group"
                      style={{
                        background: `linear-gradient(135deg, ${color}dd, ${color})`,
                      }}
                    >
                      <CardContent className="relative flex h-full flex-col justify-center p-6">
                        <div className="z-10">
                          <p className="text-sm border-b border-white/20 pb-2 mb-2 font-medium text-white/90">
                            {title}
                          </p>
                          <p className="text-3xl font-bold tracking-tight">
                            {value}
                          </p>
                          <p className="text-xs mt-1 font-semibold text-white/70">
                            {unit}
                          </p>
                        </div>
                        <div className="absolute bottom-3 right-3 transition-transform duration-500 group-hover:scale-110 opacity-40 group-hover:opacity-70">
                          <Image
                            src={image}
                            alt={title}
                            width={
                              title === "Sleep" || title === "Heart Rate"
                                ? 80
                                : 60
                            }
                            height={
                              title === "Sleep" || title === "Heart Rate"
                                ? 80
                                : 60
                            }
                            className="object-contain"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <ChartBarDefault 
                    data={weeklySteps} 
                    title={dateRange === "today" ? "Steps" : "Weekly Steps"}
                    description={dateRange === "today" ? "Steps count for today" : "Steps count for the selected period"}
                  />
                  <HeartRateLineChart data={heartRateData} />
                </div>

                {/* Readiness & Recovery */}
                <ReadinessScores data={readiness} />
              </div>

              {/* Stress & Energy */}
              {readiness?.stress && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-2xl font-bold tracking-tight">
                      Stress & Energy
                    </h3>
                    <div className="h-px bg-border flex-1 ml-4"></div>
                  </div>
                  <StressInsights stress={readiness.stress} />
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">Sleep</h3>
                  <div className="h-px bg-border flex-1 ml-4 decoration-border"></div>
                </div>
                <SleepInsights data={sleepInsightsData} />
                {/* Sleep Respiration */}
                {sleepInsightsData?.respiration?.avgBreathsPerMin && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50">
                      <p className="text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold mb-1">
                        Avg Breaths/min
                      </p>
                      <p className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                        {sleepInsightsData.respiration.avgBreathsPerMin}
                      </p>
                    </div>
                    {sleepInsightsData.respiration.snoringEvents !== null && (
                      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                        <p className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1">
                          Snoring Events
                        </p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                          {sleepInsightsData.respiration.snoringEvents}
                        </p>
                      </div>
                    )}
                    {sleepInsightsData.respiration.snoringDurationMinutes !==
                      null && (
                      <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
                        <p className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
                          Snoring Duration
                        </p>
                        <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                          {sleepInsightsData.respiration.snoringDurationMinutes}{" "}
                          <span className="text-sm font-medium">min</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ChartPieDonut data={sleepDonut} />
                  <SleepDurationBarChart data={sleepData} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Activity
                  </h3>
                  <div className="h-px bg-border flex-1 ml-4 decoration-border"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <CaloriesBarChart data={caloriesData} />
                  <DistanceLineChart data={distanceData} />
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <ActiveZoneMinutesBarChart data={activeZoneMinutesData} />
                  {activityFeed.length > 0 && (
                    <ActivityFeed activities={activityFeed} />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">Vitals</h3>
                  <div className="h-px bg-border flex-1 ml-4 decoration-border"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <WeightLineChart data={weightData} />
                  <SpO2LineChart data={spo2Data} />
                  <BodyMetricsLineChart data={bodyMetricsData} />
                </div>
                {/* Advanced Cardiovascular Metrics */}
                {advancedBody && <AdvancedVitals data={advancedBody} />}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Nutrition
                  </h3>
                  <div className="h-px bg-border flex-1 ml-4 decoration-border"></div>
                </div>
                <NutritionDashboard
                  data={nutrition}
                  caloriesBurned={caloriesBurned}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
