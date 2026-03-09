import type {
  DailyData,
  SleepData,
  BodyData,
  NutritionData,
  ActivityData,
  ParsedMetrics,
  ParsedSleepBreakdown,
  ParsedDailyEntry,
  ParsedReadiness,
  ParsedSleepInsights,
  ParsedNutrition,
  ParsedBodyMetrics,
  ParsedActivity,
} from "./types";

/**
 * Convert individual activity sessions into aggregated DailyData entries
 * grouped by date. This is a fallback when the `daily` endpoint returns
 * no data (common for newly connected Fitbit devices).
 */
export function activityToDailyFallback(
  activityData: ActivityData[],
): DailyData[] {
  if (!activityData || activityData.length === 0) return [];

  // Group activities by date (YYYY-MM-DD)
  const byDate = new Map<
    string,
    {
      steps: number;
      distance_meters: number;
      calories: number;
      hrSum: number;
      hrCount: number;
      maxHr: number;
      minHr: number;
      activitySeconds: number;
      startTime: string;
      endTime: string;
    }
  >();

  for (const act of activityData) {
    const dateKey = new Date(act.metadata.start_time)
      .toISOString()
      .split("T")[0];
    const existing = byDate.get(dateKey) || {
      steps: 0,
      distance_meters: 0,
      calories: 0,
      hrSum: 0,
      hrCount: 0,
      maxHr: 0,
      minHr: Infinity,
      activitySeconds: 0,
      startTime: act.metadata.start_time,
      endTime: act.metadata.end_time,
    };

    existing.steps += act.distance_data?.summary?.steps ?? 0;
    existing.distance_meters +=
      act.distance_data?.summary?.distance_meters ?? 0;
    existing.calories += act.calories_data?.total_burned_calories ?? 0;
    existing.activitySeconds +=
      Math.abs(
        new Date(act.metadata.end_time).getTime() -
          new Date(act.metadata.start_time).getTime(),
      ) / 1000;

    const avgHr = act.heart_rate_data?.summary?.avg_hr_bpm;
    if (avgHr) {
      existing.hrSum += avgHr;
      existing.hrCount += 1;
    }
    const maxHr = act.heart_rate_data?.summary?.max_hr_bpm;
    if (maxHr && maxHr > existing.maxHr) existing.maxHr = maxHr;

    // Update time range
    if (act.metadata.end_time > existing.endTime) {
      existing.endTime = act.metadata.end_time;
    }

    byDate.set(dateKey, existing);
  }

  // Convert grouped data into DailyData shape
  const result: DailyData[] = [];
  for (const [, agg] of byDate) {
    result.push({
      metadata: {
        start_time: agg.startTime,
        end_time: agg.endTime,
        upload_type: 1,
      },
      distance_data: {
        steps: agg.steps || undefined,
        distance_meters: agg.distance_meters || undefined,
      },
      calories_data: {
        total_burned_calories: agg.calories || undefined,
      },
      heart_rate_data:
        agg.hrCount > 0
          ? {
              summary: {
                avg_hr_bpm: Math.round(agg.hrSum / agg.hrCount),
                max_hr_bpm: agg.maxHr > 0 ? agg.maxHr : undefined,
              },
            }
          : undefined,
      active_durations_data: {
        activity_seconds: Math.round(agg.activitySeconds),
      },
    });
  }

  return result.sort(
    (a, b) =>
      new Date(a.metadata.start_time).getTime() -
      new Date(b.metadata.start_time).getTime(),
  );
}

export function parseDailyMetrics(dailyData: DailyData[]): ParsedMetrics {
  if (!dailyData || dailyData.length === 0) {
    return {
      calories: null,
      steps: null,
      sleepHours: null,
      heartRate: null,
      weight: null,
      spo2: null,
      temperature: null,
      distance: null,
    };
  }

  // Take the most recent daily entry
  const latest = dailyData[dailyData.length - 1];

  return {
    calories: latest.calories_data?.total_burned_calories ?? null,
    steps: latest.distance_data?.steps ?? null,
    sleepHours: null, // sleep comes from sleep payload
    heartRate:
      latest.heart_rate_data?.summary?.resting_hr_bpm ??
      latest.heart_rate_data?.summary?.avg_hr_bpm ??
      null,
    weight: null, // weight comes from body payload
    spo2: latest.oxygen_data?.avg_saturation_percentage ?? null,
    temperature: null, // temperature comes from body payload
    distance: latest.distance_data?.distance_meters
      ? +(latest.distance_data.distance_meters / 1000).toFixed(2)
      : null,
  };
}

/**
 * Parse sleep breakdown from the latest sleep payload.
 */
export function parseSleepBreakdown(
  sleepData: SleepData[],
): ParsedSleepBreakdown {
  const empty: ParsedSleepBreakdown = {
    deepHours: 0,
    lightHours: 0,
    remHours: 0,
    awakeHours: 0,
    totalHours: 0,
    efficiency: null,
    sleepScore: null,
  };

  if (!sleepData || sleepData.length === 0) return empty;

  // Filter out naps and get the most recent main sleep
  const mainSleep = sleepData.filter((s) => !s.metadata?.is_nap);
  const latest =
    mainSleep.length > 0
      ? mainSleep[mainSleep.length - 1]
      : sleepData[sleepData.length - 1];

  const asleep = latest.sleep_durations_data?.asleep;
  const awake = latest.sleep_durations_data?.awake;

  const deepSec = asleep?.duration_deep_sleep_state_seconds ?? 0;
  const lightSec = asleep?.duration_light_sleep_state_seconds ?? 0;
  const remSec = asleep?.duration_REM_sleep_state_seconds ?? 0;
  const awakeSec = awake?.duration_awake_state_seconds ?? 0;
  const totalSec =
    asleep?.duration_asleep_state_seconds ?? deepSec + lightSec + remSec;

  return {
    deepHours: +(deepSec / 3600).toFixed(2),
    lightHours: +(lightSec / 3600).toFixed(2),
    remHours: +(remSec / 3600).toFixed(2),
    awakeHours: +(awakeSec / 3600).toFixed(2),
    totalHours: +(totalSec / 3600).toFixed(2),
    efficiency: latest.sleep_durations_data?.sleep_efficiency ?? null,
    sleepScore: latest.scores?.sleep ?? null,
  };
}

/**
 * Parse body metrics from the latest body payload.
 */
export function parseBodyMetrics(bodyData: BodyData[]): ParsedBodyMetrics {
  const empty: ParsedBodyMetrics = {
    weight: null,
    bmi: null,
    bodyFat: null,
    temperature: null,
    avgGlucose: null,
    glucoseTimeInRange: null,
    recentSystolic: null,
    recentDiastolic: null,
  };
  if (!bodyData || bodyData.length === 0) return empty;

  const latest = bodyData[bodyData.length - 1];
  const measurement = latest.measurements_data?.measurements?.[0];
  const tempSample = latest.temperature_data?.body_temperature_samples?.[0];
  const bpSample =
    latest.blood_pressure_data?.blood_pressure_samples?.[
      latest.blood_pressure_data.blood_pressure_samples.length - 1
    ];

  return {
    weight: measurement?.weight_kg ?? null,
    bmi: measurement?.BMI ?? null,
    bodyFat: measurement?.body_fat_percentage ?? null,
    temperature: tempSample?.temperature_celsius ?? null,
    avgGlucose: latest.glucose_data?.day_avg_blood_glucose_mg_per_dL ?? null,
    glucoseTimeInRange: latest.glucose_data?.time_in_range ?? null,
    recentSystolic: bpSample?.systolic_bp ?? null,
    recentDiastolic: bpSample?.diastolic_bp ?? null,
  };
}

/**
 * Convert an array of DailyData into chart-friendly entries (one per day).
 */
export function parseDailyTimeSeries(
  dailyData: DailyData[],
): ParsedDailyEntry[] {
  if (!dailyData || dailyData.length === 0) return [];

  return dailyData.map((day) => {
    const date = new Date(day.metadata.start_time);
    const dateStr = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    const activeSeconds =
      (day.active_durations_data?.moderate_intensity_seconds ?? 0) +
      (day.active_durations_data?.vigorous_intensity_seconds ?? 0);

    return {
      date: dateStr,
      steps: day.distance_data?.steps ?? 0,
      calories: day.calories_data?.total_burned_calories ?? 0,
      distance: day.distance_data?.distance_meters
        ? +(day.distance_data.distance_meters / 1000).toFixed(2)
        : 0,
      heartRate:
        day.heart_rate_data?.summary?.resting_hr_bpm ??
        day.heart_rate_data?.summary?.avg_hr_bpm ??
        null,
      activeMinutes: Math.round(activeSeconds / 60),
      spo2: day.oxygen_data?.avg_saturation_percentage ?? null,
    };
  });
}

/**
 * Parse sleep time series from SleepData array — one entry per night.
 */
export function parseSleepTimeSeries(
  sleepData: SleepData[],
): Array<{ date: string; hours: number }> {
  if (!sleepData || sleepData.length === 0) return [];

  return sleepData
    .filter((s) => !s.metadata?.is_nap)
    .map((s) => {
      const date = new Date(s.metadata.start_time);
      const dateStr = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const totalSec =
        s.sleep_durations_data?.asleep?.duration_asleep_state_seconds ??
        (s.sleep_durations_data?.asleep?.duration_deep_sleep_state_seconds ??
          0) +
          (s.sleep_durations_data?.asleep?.duration_light_sleep_state_seconds ??
            0) +
          (s.sleep_durations_data?.asleep?.duration_REM_sleep_state_seconds ??
            0);

      return {
        date: dateStr,
        hours: +(totalSec / 3600).toFixed(2),
      };
    });
}

export function parseReadiness(dailyData: DailyData[]): ParsedReadiness {
  const empty: ParsedReadiness = {
    recoveryScore: null,
    activityScore: null,
    sleepScore: null,
    hsRmssd: null,
    hrvSdnn: null,
    vo2Max: null,
    stress: {
      avgStressLevel: null,
      maxStressLevel: null,
      totalStressDurationMinutes: null,
      highStressMinutes: null,
      mediumStressMinutes: null,
      lowStressMinutes: null,
      restStressMinutes: null,
    },
  };
  if (!dailyData || dailyData.length === 0) return empty;

  const latest = dailyData[dailyData.length - 1];
  const stress = latest.stress_data;

  return {
    recoveryScore: latest.scores?.recovery ?? null,
    activityScore: latest.scores?.activity ?? null,
    sleepScore: latest.scores?.sleep ?? null,
    hsRmssd: latest.heart_rate_data?.summary?.avg_hrv_rmssd ?? null,
    hrvSdnn: latest.heart_rate_data?.summary?.avg_hrv_sdnn ?? null,
    vo2Max: latest.oxygen_data?.vo2max_ml_per_min_per_kg ?? null,
    stress: {
      avgStressLevel: stress?.avg_stress_level ?? null,
      maxStressLevel: stress?.max_stress_level ?? null,
      totalStressDurationMinutes: stress?.stress_duration_seconds
        ? +(stress.stress_duration_seconds / 60).toFixed(0)
        : null,
      highStressMinutes: stress?.high_stress_duration_seconds
        ? +(stress.high_stress_duration_seconds / 60).toFixed(0)
        : null,
      mediumStressMinutes: stress?.medium_stress_duration_seconds
        ? +(stress.medium_stress_duration_seconds / 60).toFixed(0)
        : null,
      lowStressMinutes: stress?.low_stress_duration_seconds
        ? +(stress.low_stress_duration_seconds / 60).toFixed(0)
        : null,
      restStressMinutes: stress?.rest_stress_duration_seconds
        ? +(stress.rest_stress_duration_seconds / 60).toFixed(0)
        : null,
    },
  };
}

/**
 * Parse advanced sleep insights from the latest sleep session.
 */
export function parseSleepInsights(
  sleepData: SleepData[],
): ParsedSleepInsights {
  const empty: ParsedSleepInsights = {
    efficiency: null,
    sleepScore: null,
    latencyMinutes: null,
    wakeupEvents: null,
    timeInBedHours: null,
    totalSleepHours: 0,
    temperatureDelta: null,
    sleepHR: { avg: null, min: null, max: null, resting: null },
    stages: { deepHours: 0, lightHours: 0, remHours: 0, awakeHours: 0 },
    respiration: {
      avgBreathsPerMin: null,
      snoringEvents: null,
      snoringDurationMinutes: null,
    },
  };
  if (!sleepData || sleepData.length === 0) return empty;

  const mainSleep = sleepData.filter((s) => !s.metadata?.is_nap);
  const latest =
    mainSleep.length > 0
      ? mainSleep[mainSleep.length - 1]
      : sleepData[sleepData.length - 1];

  const asleep = latest.sleep_durations_data?.asleep;
  const awake = latest.sleep_durations_data?.awake;
  const deepSec = asleep?.duration_deep_sleep_state_seconds ?? 0;
  const lightSec = asleep?.duration_light_sleep_state_seconds ?? 0;
  const remSec = asleep?.duration_REM_sleep_state_seconds ?? 0;
  const awakeSec = awake?.duration_awake_state_seconds ?? 0;
  const totalSec =
    asleep?.duration_asleep_state_seconds ?? deepSec + lightSec + remSec;
  const inBedSec =
    latest.sleep_durations_data?.other?.duration_in_bed_seconds ?? 0;
  const latencySec = awake?.sleep_latency_seconds ?? null;

  return {
    efficiency: latest.sleep_durations_data?.sleep_efficiency ?? null,
    sleepScore: latest.scores?.sleep ?? null,
    latencyMinutes: latencySec !== null ? +(latencySec / 60).toFixed(1) : null,
    wakeupEvents: awake?.num_wakeup_events ?? null,
    timeInBedHours: inBedSec > 0 ? +(inBedSec / 3600).toFixed(2) : null,
    totalSleepHours: +(totalSec / 3600).toFixed(2),
    temperatureDelta: latest.temperature_data?.delta ?? null,
    sleepHR: {
      avg: latest.heart_rate_data?.summary?.avg_hr_bpm ?? null,
      min: latest.heart_rate_data?.summary?.min_hr_bpm ?? null,
      max: latest.heart_rate_data?.summary?.max_hr_bpm ?? null,
      resting: latest.heart_rate_data?.summary?.resting_hr_bpm ?? null,
    },
    stages: {
      deepHours: +(deepSec / 3600).toFixed(2),
      lightHours: +(lightSec / 3600).toFixed(2),
      remHours: +(remSec / 3600).toFixed(2),
      awakeHours: +(awakeSec / 3600).toFixed(2),
    },
    respiration: {
      avgBreathsPerMin:
        latest.respiration_data?.breaths_data?.avg_breaths_per_min ?? null,
      snoringEvents:
        latest.respiration_data?.snoring_data?.num_snoring_events ?? null,
      snoringDurationMinutes: latest.respiration_data?.snoring_data
        ?.total_snoring_duration_seconds
        ? +(
            latest.respiration_data.snoring_data
              .total_snoring_duration_seconds / 60
          ).toFixed(1)
        : null,
    },
  };
}

export function parseNutrition(
  nutritionData: NutritionData[],
): ParsedNutrition {
  const empty: ParsedNutrition = {
    totalCalories: null,
    protein: null,
    carbs: null,
    fat: null,
    fiber: null,
    sugar: null,
    water: null,
    meals: [],
  };
  if (!nutritionData || nutritionData.length === 0) return empty;

  const latest = nutritionData[nutritionData.length - 1];
  const macros = latest.summary?.macros;
  return {
    totalCalories: macros?.calories ?? null,
    protein: macros?.protein_g ?? null,
    carbs: macros?.carbohydrates_g ?? null,
    fat: macros?.fat_g ?? null,
    fiber: macros?.fiber_g ?? null,
    sugar: macros?.sugar_g ?? null,
    water: latest.summary?.water_ml
      ? +(latest.summary.water_ml / 1000).toFixed(2)
      : null,
    meals: (latest.meals || [])
      .filter((m) => m.name || m.macros?.calories)
      .map((m) => ({
        name: m.name || "Meal",
        calories: m.macros?.calories ?? 0,
        protein: m.macros?.protein_g ?? 0,
        carbs: m.macros?.carbohydrates_g ?? 0,
        fat: m.macros?.fat_g ?? 0,
      })),
  };
}

export function parseActivityFeed(
  activityData: ActivityData[],
): ParsedActivity[] {
  if (!activityData || activityData.length === 0) return [];

  return activityData
    .map((act) => {
      const start = new Date(act.metadata.start_time);
      const end = new Date(act.metadata.end_time);
      const durationSeconds = (end.getTime() - start.getTime()) / 1000;

      return {
        id: act.metadata.summary_id || start.getTime().toString(),
        name: act.metadata.name || "Workout",
        type: act.metadata.type,
        startTime: act.metadata.start_time,
        durationMinutes: Math.round(durationSeconds / 60),
        calories: act.calories_data?.total_burned_calories ?? null,
        distance: act.distance_data?.summary?.distance_meters ?? null,
        steps: act.distance_data?.summary?.steps ?? null,
        avgHr: act.heart_rate_data?.summary?.avg_hr_bpm ?? null,
        maxHr: act.heart_rate_data?.summary?.max_hr_bpm ?? null,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
}
