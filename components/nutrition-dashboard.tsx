"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Apple,
  Droplets,
  Flame,
  Beef,
  Wheat,
  CakeSlice,
  UtensilsCrossed,
} from "lucide-react";
import type { ParsedNutrition } from "@/lib/terra/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const MACRO_COLORS = {
  protein: "#3b82f6",
  carbs: "#f59e0b",
  fat: "#8b5cf6",
};

function MacrosDonut({
  protein,
  carbs,
  fat,
}: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  const total = protein + carbs + fat;
  if (total === 0) return null;

  const data = [
    { name: "Protein", value: protein, color: MACRO_COLORS.protein },
    { name: "Carbs", value: carbs, color: MACRO_COLORS.carbs },
    { name: "Fat", value: fat, color: MACRO_COLORS.fat },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value.toFixed(0)}g`, undefined]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {total.toFixed(0)}
          </span>
          <span className="text-[10px] text-muted-foreground">grams</span>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        {data.map((d) => (
          <span
            key={d.name}
            className="flex items-center gap-1 text-[10px] text-muted-foreground"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: d.color }}
            />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function CaloriesComparison({
  consumed,
  burned,
}: {
  consumed: number | null;
  burned: number | null;
}) {
  if (consumed === null && burned === null) return null;

  const data = [
    { name: "Consumed", value: consumed ?? 0, fill: "#10b981" },
    { name: "Burned", value: burned ?? 0, fill: "#f43f5e" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Calories In vs Out
      </p>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={12}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                `${value.toLocaleString()} kcal`,
                undefined,
              ]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface NutritionDashboardProps {
  data: ParsedNutrition | null;
  caloriesBurned: number | null;
}

export default function NutritionDashboard({
  data,
  caloriesBurned,
}: NutritionDashboardProps) {
  if (!data) return null;

  const hasAnyData =
    data.totalCalories !== null ||
    data.protein !== null ||
    data.carbs !== null ||
    data.fat !== null;

  if (!hasAnyData) {
    return (
      <Card className="border-dashed border-border">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground text-center">
            Connect a nutrition app (MyFitnessPal, Cronometer) to see nutrition
            data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Apple className="w-5 h-5 text-emerald-500" />
          Nutrition
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Macros Donut */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Macronutrients
            </p>
            <MacrosDonut
              protein={data.protein ?? 0}
              carbs={data.carbs ?? 0}
              fat={data.fat ?? 0}
            />
          </div>

          {/* Calories comparison */}
          <div>
            <CaloriesComparison
              consumed={data.totalCalories}
              burned={caloriesBurned}
            />
          </div>

          {/* Nutrient Stats */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Details</p>
            {data.totalCalories !== null && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">
                    Calories
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.totalCalories.toLocaleString()} kcal
                  </span>
                </div>
              </div>
            )}
            {data.protein !== null && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                <Beef
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: MACRO_COLORS.protein }}
                />
                <div className="flex-1 flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Protein</span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.protein.toFixed(0)}g
                  </span>
                </div>
              </div>
            )}
            {data.carbs !== null && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                <Wheat
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: MACRO_COLORS.carbs }}
                />
                <div className="flex-1 flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Carbs</span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.carbs.toFixed(0)}g
                  </span>
                </div>
              </div>
            )}
            {data.fat !== null && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                <CakeSlice
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: MACRO_COLORS.fat }}
                />
                <div className="flex-1 flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Fat</span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.fat.toFixed(0)}g
                  </span>
                </div>
              </div>
            )}
            {data.water !== null && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                <Droplets className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <div className="flex-1 flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Water</span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.water}L
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meals */}
        {data.meals.length > 0 && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Meals
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.meals.map((meal, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {meal.name}
                  </p>
                  <div className="flex gap-3 text-[10px] text-muted-foreground">
                    <span>{meal.calories} kcal</span>
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
