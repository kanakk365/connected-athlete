"use client";

import { cn } from "@/lib/utils";

const ranges = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-muted/50 p-1 border border-border">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            value === range.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
