"use client";

import Image from "next/image";
import Link from "next/link";
import { Smartphone, ChevronDown, Activity, Moon, Zap, Apple } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type {
  DailyData,
  SleepData,
  BodyData,
  NutritionData,
  ActivityData,
  ConnectedDevice,
} from "@/lib/terra/types";
import {
  parseDailyMetrics,
  parseDailyMetricsAvg,
  parseSleepBreakdown,
  parseSleepAvgHours,
  parseBodyMetrics,
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

export default function HealthCharts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const dateRange = "7d";
  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);

  const onConnectTerra = async () => {
    try {
      setError(null);
      const res = await fetch("/api/terra/generate-widget", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate widget session");
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        throw new Error("No URL returned from Terra widget");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };


  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch all connected Terra users
      const usersRes = await fetch("/api/terra/users");
      const usersJson = await usersRes.json();
      const users: Array<{
        user_id: string;
        provider: string;
        active: boolean;
        reference_id: string;
        last_webhook_update: string;
      }> = usersJson.users || [];

      const connectedDevices: ConnectedDevice[] = users.map((u) => ({
        userId: u.user_id,
        provider: u.provider,
        active: u.active,
        referenceId: u.reference_id,
        lastWebhookUpdate: u.last_webhook_update,
      }));
      setDevices(connectedDevices);

      if (connectedDevices.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Compute date range
      const { start, end } = getDateRange(dateRange);
      const dateParams = `&start_date=${start}&end_date=${end}`;

      // 3. Fetch data from all devices
      let allDaily: DailyData[] = [];
      let allSleep: SleepData[] = [];
      let allBody: BodyData[] = [];
      let allNutrition: NutritionData[] = [];
      let allActivity: ActivityData[] = [];

      await Promise.all(
        connectedDevices.map(async (device) => {
          try {
            const [dailyRes, sleepRes, bodyRes, nutritionRes, activityRes] =
              await Promise.all([
                fetch(
                  `/api/terra/data?user_id=${device.userId}&type=daily${dateParams}`,
                ),
                fetch(
                  `/api/terra/data?user_id=${device.userId}&type=sleep${dateParams}`,
                ),
                fetch(
                  `/api/terra/data?user_id=${device.userId}&type=body${dateParams}`,
                ),
                fetch(
                  `/api/terra/data?user_id=${device.userId}&type=nutrition${dateParams}`,
                ),
                fetch(
                  `/api/terra/data?user_id=${device.userId}&type=activity${dateParams}`,
                ),
              ]);

            const dailyJson = await dailyRes.json();
            const sleepJson = await sleepRes.json();
            const bodyJson = await bodyRes.json();
            const nutritionJson = await nutritionRes.json();
            const activityJson = await activityRes.json();

            if (dailyJson.data) allDaily = [...allDaily, ...dailyJson.data];
            if (sleepJson.data) allSleep = [...allSleep, ...sleepJson.data];
            if (bodyJson.data) allBody = [...allBody, ...bodyJson.data];
            if (nutritionJson.data)
              allNutrition = [...allNutrition, ...nutritionJson.data];
            if (activityJson.data)
              allActivity = [...allActivity, ...activityJson.data];
          } catch (e) {
            console.warn(
              `Failed to fetch data for device ${device.provider}:`,
              e,
            );
          }
        }),
      );

      // Sort by date
      allDaily.sort(
        (a, b) =>
          new Date(a.metadata.start_time).getTime() -
          new Date(b.metadata.start_time).getTime(),
      );
      allSleep.sort(
        (a, b) =>
          new Date(a.metadata.start_time).getTime() -
          new Date(b.metadata.start_time).getTime(),
      );

      // 3.5 Fallback: if daily data is empty but activity data exists,
      // aggregate activity sessions into daily entries
      if (allDaily.length === 0 && allActivity.length > 0) {
        console.log(
          `No daily data found, using ${allActivity.length} activity session(s) as fallback`,
        );
        allDaily = activityToDailyFallback(allActivity);
      }

      // 4. Parse aggregated metrics
      const isToday = false;
      const dailyMetrics = isToday
        ? parseDailyMetrics(allDaily)
        : parseDailyMetricsAvg(allDaily);
      const sleepBreakdown = parseSleepBreakdown(allSleep);
      const sleepHours = isToday
        ? sleepBreakdown.totalHours
        : parseSleepAvgHours(allSleep);
      const bodyMetricsParsed = parseBodyMetrics(allBody);
      const prefix = isToday ? "" : "Avg ";

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

    } catch (err: unknown) {
      console.error("Error fetching Terra data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle redirect from Terra widget
  useEffect(() => {
    const status = searchParams.get("terra_status");
    if (status === "success") {
      router.replace("/dashboard");
    } else if (status === "failure") {
      setError("Device connection failed. Please try again.");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return (
    <div className="space-y-6">
      {/* Header & Hover Menu for Devices */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-foreground">Health Metrics</h2>
        <div className="group relative inline-block z-50">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium text-sm transition-all hover:ring-2 hover:ring-blue-500/50">
            <Smartphone className="w-4 h-4" />
            {devices.length} {devices.length === 1 ? 'Device' : 'Devices'} Connected
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </button>
          
          <div className="absolute top-full mt-2 right-0 w-64 bg-background border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            {devices.length > 0 ? (
              <div className="p-2 space-y-1">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Devices</p>
                </div>
                {devices.map(d => (
                  <Link 
                    key={d.userId} 
                    href={`/dashboard/device/${d.userId}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group/item"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none text-foreground">{d.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1">View details →</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="border-t p-2">
              <button 
                onClick={onConnectTerra} 
                className="w-full text-center text-xs font-medium p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                + Connect Another Device
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-6 animate-in fade-in duration-500 mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
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

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
