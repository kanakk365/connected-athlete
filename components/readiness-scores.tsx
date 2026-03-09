"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Flame, Moon, Brain, Heart, Wind } from "lucide-react";
import type { ParsedReadiness } from "@/lib/terra/types";

function getScoreColor(score: number, invert = false): string {
  const v = invert ? 100 - score : score;
  if (v >= 75) return "#10b981";
  if (v >= 50) return "#3b82f6";
  if (v >= 25) return "#f59e0b";
  return "#ef4444";
}

function CircularGauge({
  score,
  label,
  icon: Icon,
  color,
}: {
  score: number | null;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  const hasData = score !== null;
  const displayScore = score ?? 0;
  const size = 100;
  const strokeW = 5;
  const radius = (size - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = hasData ? (displayScore / 100) * circumference : 0;
  const dashoffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-2">
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
              className="drop-shadow-sm"
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4 mb-0.5" style={{ color }} />
          <span className="text-xl font-bold text-foreground">
            {hasData ? displayScore : "—"}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

interface ReadinessScoresProps {
  data: ParsedReadiness | null;
}

export default function ReadinessScores({ data }: ReadinessScoresProps) {
  if (!data) return null;

  const hasAnyScore =
    data.recoveryScore !== null ||
    data.activityScore !== null ||
    data.sleepScore !== null ||
    data.stress?.avgStressLevel !== null;
  const hasAnyHrv =
    data.hsRmssd !== null || data.hrvSdnn !== null || data.vo2Max !== null;

  if (!hasAnyScore && !hasAnyHrv) {
    return (
      <Card className="border-dashed border-border">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground text-center">
            Connect a device that supports readiness scores (Garmin, Oura,
            Whoop) to see recovery data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Readiness &amp; Recovery
        </h3>

        {/* Score Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <CircularGauge
            score={data.recoveryScore}
            label="Recovery"
            icon={ShieldCheck}
            color={
              data.recoveryScore !== null
                ? getScoreColor(data.recoveryScore)
                : "#6b7280"
            }
          />
          <CircularGauge
            score={data.activityScore}
            label="Activity"
            icon={Flame}
            color={
              data.activityScore !== null
                ? getScoreColor(data.activityScore)
                : "#6b7280"
            }
          />
          <CircularGauge
            score={data.sleepScore}
            label="Sleep"
            icon={Moon}
            color={
              data.sleepScore !== null
                ? getScoreColor(data.sleepScore)
                : "#6b7280"
            }
          />
          <CircularGauge
            score={data.stress?.avgStressLevel ?? null}
            label="Stress"
            icon={Brain}
            color={
              data.stress?.avgStressLevel !== null
                ? getScoreColor(data.stress.avgStressLevel!, true)
                : "#6b7280"
            }
          />
        </div>

        {/* HRV & VO2 Max Stats */}
        {hasAnyHrv && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">HRV (RMSSD)</p>
                <p className="text-sm font-semibold text-foreground">
                  {data.hsRmssd !== null
                    ? `${data.hsRmssd.toFixed(1)} ms`
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Heart className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">HRV (SDNN)</p>
                <p className="text-sm font-semibold text-foreground">
                  {data.hrvSdnn !== null
                    ? `${data.hrvSdnn.toFixed(1)} ms`
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Wind className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">VO₂ Max</p>
                <p className="text-sm font-semibold text-foreground">
                  {data.vo2Max !== null
                    ? `${data.vo2Max.toFixed(1)} ml/kg/min`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
