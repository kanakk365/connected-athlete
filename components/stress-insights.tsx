import { Card, CardContent } from "@/components/ui/card";
import { ParsedStress } from "@/lib/terra/types";
import { Brain, Battery, BrainCircuit, Waves, Zap } from "lucide-react";

export default function StressInsights({ stress }: { stress: ParsedStress }) {
  if (!stress.avgStressLevel && !stress.totalStressDurationMinutes) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stress.avgStressLevel !== null && (
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Daily Average
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Average Stress Level
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-300">
                  {stress.avgStressLevel}
                </p>
                <span className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70">
                  / 100
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {stress.restStressMinutes !== null && (
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border-teal-100 dark:border-teal-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                  <Battery className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Recovery
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Rest & Recovery Time
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight text-teal-700 dark:text-teal-300">
                  {stress.restStressMinutes}
                </p>
                <span className="text-sm font-medium text-teal-600/70 dark:text-teal-400/70">
                  min
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {stress.totalStressDurationMinutes !== null &&
        stress.totalStressDurationMinutes > 0 && (
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Stress Duration Breakdown
              </h4>
              <div className="space-y-4">
                {stress.lowStressMinutes !== null &&
                  stress.lowStressMinutes > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Low Stress</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stress.lowStressMinutes} min
                      </span>
                    </div>
                  )}
                {stress.mediumStressMinutes !== null &&
                  stress.mediumStressMinutes > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">
                          Medium Stress
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stress.mediumStressMinutes} min
                      </span>
                    </div>
                  )}
                {stress.highStressMinutes !== null &&
                  stress.highStressMinutes > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">High Stress</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stress.highStressMinutes} min
                      </span>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
