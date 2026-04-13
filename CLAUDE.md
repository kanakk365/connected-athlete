# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run lint      # Run ESLint (Next.js + TypeScript rules)
```

No test suite is configured.

## Environment Variables

Required in `.env`:
```
TERRA_DEV_ID=...
TERRA_API_KEY=...
```

These are used in `lib/terra/config.ts` to authenticate all requests to the Terra REST API (`https://access.tryterra.co/api/v2`).

## Architecture

This is a **Next.js 15 App Router** health/fitness dashboard that aggregates wearable device data via the [Terra API](https://docs.tryterra.co).

### Key Data Flow

1. **UI components** (`components/health-charts.tsx`, `sleep-insights.tsx`, etc.) fetch data client-side from `/api/terra/data`
2. **API routes** (`app/api/terra/`) proxy requests to Terra, chunking date ranges >28 days into ≤28-day segments (Terra's limit), then merging results
3. **Parse layer** (`lib/terra/parse.ts`) transforms raw Terra API responses into typed metrics consumed by charts

### Directory Layout

- `app/api/terra/` — API route handlers (data, users, deauthenticate, generate-widget)
- `app/dashboard/` — Main dashboard page; `device/[userId]/` for per-device detail view
- `components/` — All UI components; `ui/` contains shadcn/ui primitives
- `lib/terra/` — Terra API config, TypeScript types (`TerraUser`, `DailyData`, `SleepData`, etc.), and parse utilities

### Terra Data Types

The app works with five Terra data categories: `DailyData` (steps, HR, stress, scores), `SleepData` (sleep stages), `BodyData` (weight, BMI, glucose), `ActivityData` (workout sessions), and `NutritionData` (macros, meals). All types are defined in `lib/terra/types.ts`.

### UI Stack

- **Tailwind CSS 4** + **shadcn/ui** (new-york style, neutral base, CSS variables for theming)
- **Recharts** for all data visualizations
- **next-themes** for dark mode support
- Path alias `@/*` maps to the repo root

### Patterns to Follow

- Components that fetch data or use hooks must be marked `"use client"`
- Use skeleton loaders (`components/ui/skeleton.tsx`) while data is loading
- Multi-device support: users are identified by `userId` (Terra's reference ID); the sidebar lists connected devices fetched from `/api/terra/users`
- `activityToDailyFallback()` in `lib/terra/parse.ts` synthesizes daily summaries from activity data for newly connected devices that lack daily aggregates (e.g., new Fitbit connections)
