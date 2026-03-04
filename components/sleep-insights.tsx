"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Clock,
  AlertCircle,
  Thermometer,
  Heart,
  BedDouble,
} from "lucide-react";
import type { ParsedSleepInsights } from "@/lib/terra/types";

const stageColors = {
  deep: "#6366f1",
  light: "#ec4899",
  rem: "#8b5cf6",
  awake: "#f59e0b",
};

function SleepScoreGauge({ score }: { score: number | null }) {
  const hasData = score !== null;
  const val = score ?? 0;
  const size = 80;
  const strokeW = 5;
  const radius = (size - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = hasData ? (val / 100) * circumference : 0;
  const dashoffset = circumference - progress;
  const color = hasData
    ? val >= 80
      ? "#10b981"
      : val >= 60
        ? "#3b82f6"
        : val >= 40
          ? "#f59e0b"
          : "#ef4444"
    : "#6b7280";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeW}
            className="text-muted/20"
          />
          {hasData && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Moon className="w-3 h-3 mb-0.5" style={{ color }} />
          <span className="text-lg font-bold text-foreground">
            {hasData ? val : "—"}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">
        Sleep Score
      </span>
    </div>
  );
}

function Hypnogram({ stages }: { stages: ParsedSleepInsights["stages"] }) {
  const total =
    stages.deepHours + stages.lightHours + stages.remHours + stages.awakeHours;
  if (total === 0) return null;
  const pct = (val: number) => ((val / total) * 100).toFixed(1);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Sleep Stages</p>
      <div className="flex h-7 rounded-lg overflow-hidden gap-0.5">
        {stages.deepHours > 0 && (
          <div
            className="rounded-sm transition-all duration-700"
            style={{
              width: `${pct(stages.deepHours)}%`,
              backgroundColor: stageColors.deep,
            }}
          />
        )}
        {stages.lightHours > 0 && (
          <div
            className="rounded-sm transition-all duration-700"
            style={{
              width: `${pct(stages.lightHours)}%`,
              backgroundColor: stageColors.light,
            }}
          />
        )}
        {stages.remHours > 0 && (
          <div
            className="rounded-sm transition-all duration-700"
            style={{
              width: `${pct(stages.remHours)}%`,
              backgroundColor: stageColors.rem,
            }}
          />
        )}
        {stages.awakeHours > 0 && (
          <div
            className="rounded-sm transition-all duration-700"
            style={{
              width: `${pct(stages.awakeHours)}%`,
              backgroundColor: stageColors.awake,
            }}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: stageColors.deep }}
          />
          Deep {stages.deepHours}h
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: stageColors.light }}
          />
          Light {stages.lightHours}h
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: stageColors.rem }}
          />
          REM {stages.remHours}h
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-sm inline-block"
            style={{ backgroundColor: stageColors.awake }}
          />
          Awake {stages.awakeHours}h
        </span>
      </div>
    </div>
  );
}

function StatBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      <div>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface SleepInsightsProps {
  data: ParsedSleepInsights | null;
}

export default function SleepInsights({ data }: SleepInsightsProps) {
  if (!data || data.totalSleepHours === 0) return null;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Moon className="w-5 h-5 text-violet-500" />
          Sleep Insights
        </h3>

        {/* Top row: Score + Efficiency + Temp */}
        <div className="flex flex-wrap items-start gap-6 mb-6">
          <SleepScoreGauge score={data.sleepScore} />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.efficiency !== null && (
              <StatBadge
                icon={BedDouble}
                label="Efficiency"
                value={`${(data.efficiency * 100).toFixed(0)}%`}
                color="#8b5cf6"
              />
            )}
            {data.latencyMinutes !== null && (
              <StatBadge
                icon={Clock}
                label="Fell Asleep In"
                value={`${data.latencyMinutes} min`}
                color="#3b82f6"
              />
            )}
            {data.wakeupEvents !== null && (
              <StatBadge
                icon={AlertCircle}
                label="Wakeups"
                value={`${data.wakeupEvents}`}
                color="#f59e0b"
              />
            )}
            {data.timeInBedHours !== null && (
              <StatBadge
                icon={BedDouble}
                label="Time In Bed"
                value={`${data.timeInBedHours}h`}
                color="#6366f1"
              />
            )}
            {data.temperatureDelta !== null && (
              <StatBadge
                icon={Thermometer}
                label="Temp Delta"
                value={`${data.temperatureDelta > 0 ? "+" : ""}${data.temperatureDelta.toFixed(1)}°C`}
                color="#ec4899"
              />
            )}
          </div>
        </div>

        {/* Hypnogram */}
        <Hypnogram stages={data.stages} />

        {/* Sleep Heart Rate */}
        {(data.sleepHR.avg !== null || data.sleepHR.resting !== null) && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Sleep Heart Rate
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.sleepHR.resting !== null && (
                <StatBadge
                  icon={Heart}
                  label="Resting"
                  value={`${data.sleepHR.resting} BPM`}
                  color="#f43f5e"
                />
              )}
              {data.sleepHR.avg !== null && (
                <StatBadge
                  icon={Heart}
                  label="Average"
                  value={`${data.sleepHR.avg} BPM`}
                  color="#ec4899"
                />
              )}
              {data.sleepHR.min !== null && (
                <StatBadge
                  icon={Heart}
                  label="Minimum"
                  value={`${data.sleepHR.min} BPM`}
                  color="#8b5cf6"
                />
              )}
              {data.sleepHR.max !== null && (
                <StatBadge
                  icon={Heart}
                  label="Maximum"
                  value={`${data.sleepHR.max} BPM`}
                  color="#f59e0b"
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
