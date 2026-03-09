import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedActivity } from "@/lib/terra/types";
import { Activity, Flame, Heart, MapPin, Timer } from "lucide-react";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

export default function ActivityFeed({
  activities,
}: {
  activities: ParsedActivity[] | null;
}) {
  if (!activities || activities.length === 0) return null;

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          Recent Workouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col space-y-1 mb-4 md:mb-0">
                <span className="font-semibold text-lg">{act.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(act.startTime)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                {act.durationMinutes > 0 && (
                  <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-lg shadow-sm">
                    <Timer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {act.durationMinutes} min
                    </span>
                  </div>
                )}
                {act.calories && act.calories > 0 ? (
                  <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-lg shadow-sm">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      {act.calories} kcal
                    </span>
                  </div>
                ) : null}
                {act.avgHr && act.avgHr > 0 ? (
                  <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-lg shadow-sm">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-medium">{act.avgHr} bpm</span>
                  </div>
                ) : null}
                {act.distance && act.distance > 0 ? (
                  <div className="flex items-center gap-1.5 bg-background border px-3 py-1.5 rounded-lg shadow-sm">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">
                      {(act.distance / 1000).toFixed(2)} km
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
