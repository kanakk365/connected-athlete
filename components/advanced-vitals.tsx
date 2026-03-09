import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedBodyMetrics } from "@/lib/terra/types";
import { ActivitySquare, HeartPulse, Droplets } from "lucide-react";

export default function AdvancedVitals({ data }: { data: ParsedBodyMetrics }) {
  if (!data) return null;

  const hasAdvancedData =
    data.avgGlucose !== null ||
    data.recentSystolic !== null ||
    data.recentDiastolic !== null;

  if (!hasAdvancedData) return null;

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ActivitySquare className="h-5 w-5 text-rose-500" />
          Advanced Cardiovascular Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.avgGlucose !== null && (
          <div className="flex flex-col space-y-2 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Average Blood Glucose
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-orange-700 dark:text-orange-400">
                {data.avgGlucose}
              </span>
              <span className="text-sm font-medium text-orange-600/70 dark:text-orange-400/70">
                mg/dL
              </span>
            </div>
            {data.glucoseTimeInRange !== null && (
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">
                Time in range: {data.glucoseTimeInRange}%
              </p>
            )}
          </div>
        )}

        {data.recentSystolic !== null && data.recentDiastolic !== null && (
          <div className="flex flex-col space-y-2 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span className="text-sm font-medium text-rose-800 dark:text-rose-300">
                Blood Pressure
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-rose-700 dark:text-rose-400">
                {data.recentSystolic}/{data.recentDiastolic}
              </span>
              <span className="text-sm font-medium text-rose-600/70 dark:text-rose-400/70">
                mmHg
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
