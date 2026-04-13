"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Connected Athlete?",
    answer: (
      <div className="space-y-3">
        <p>
          Connected Athlete is a unified data OS for performance coaches and
          athletes. It aggregates biometric data from 50+ wearable devices
          through the Terra API into one real-time stream.
        </p>
        <div className="space-y-2">
          <p className="font-semibold text-[#ccc]">The platform includes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>A live performance dashboard with per-device detail views</li>
            <li>HRV, sleep stage, and recovery score pipelines</li>
            <li>Nutrition and body composition tracking</li>
            <li>Real-time biometric overlays for coaching sessions</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    question: "Which wearable devices are supported?",
    answer: (
      <div className="space-y-3">
        <p>
          Any device supported by the Terra API works out of the box. This
          currently includes:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Garmin, Whoop, Apple Watch, Oura Ring, Polar, Fitbit</li>
          <li>Suunto, Coros, Withings, Wahoo, Samsung Health, Google Fit</li>
          <li>Eight Sleep, Biostrap, Peloton, Zwift, Concept2, and more</li>
        </ul>
        <p>
          New integrations added by Terra are automatically available without
          any changes to the platform.
        </p>
      </div>
    ),
  },
  {
    question: "How does data syncing work?",
    answer: (
      <div className="space-y-3">
        <p>
          Data is fetched client-side from our API routes, which proxy to the
          Terra REST API. We automatically chunk date ranges larger than 28 days
          into segments (Terra&apos;s limit) and merge the results transparently.
        </p>
        <p>
          For newly connected devices that lack daily aggregates — such as
          fresh Fitbit connections — the platform synthesises daily summaries
          from raw activity data so your dashboard is never empty.
        </p>
      </div>
    ),
  },
  {
    question: "What data categories does the platform track?",
    answer: (
      <div className="space-y-3">
        <p>Five core data types are supported:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li><span className="font-semibold text-[#ccc]">Daily Data</span> — steps, heart rate, stress, readiness scores</li>
          <li><span className="font-semibold text-[#ccc]">Sleep Data</span> — sleep stages and quality metrics</li>
          <li><span className="font-semibold text-[#ccc]">Body Data</span> — weight, BMI, blood glucose</li>
          <li><span className="font-semibold text-[#ccc]">Activity Data</span> — individual workout sessions</li>
          <li><span className="font-semibold text-[#ccc]">Nutrition Data</span> — macros, hydration, meal logs</li>
        </ol>
      </div>
    ),
  },
  {
    question: "Can I monitor multiple athletes at once?",
    answer: (
      <div className="space-y-3">
        <p>
          Yes. The sidebar lists all connected devices fetched from the users
          endpoint. Each athlete is identified by a unique Terra reference ID
          and has a dedicated per-device detail view under{" "}
          <span className="font-mono text-[#7C5CFC]">/dashboard/device/[userId]</span>.
        </p>
        <p>
          Coaches can switch between athletes instantly without leaving the
          dashboard.
        </p>
      </div>
    ),
  },
  {
    question: "What environment variables do I need to get started?",
    answer: (
      <div className="space-y-3">
        <p>Create a <span className="font-mono text-[#7C5CFC]">.env</span> file at the repo root with:</p>
        <div className="font-mono text-[13px] bg-[#0f0f0f] border border-[#222] px-4 py-3 text-[#7C5CFC] space-y-1">
          <p>TERRA_DEV_ID=...</p>
          <p>TERRA_API_KEY=...</p>
        </div>
        <p>
          Both values are available in your Terra developer dashboard. All API
          requests are authenticated via these credentials in{" "}
          <span className="font-mono text-[#7C5CFC]">lib/terra/config.ts</span>.
        </p>
      </div>
    ),
  },
  {
    question: "Is there a local development server?",
    answer: (
      <div className="space-y-3">
        <p>Run the dev server with Turbopack:</p>
        <div className="font-mono text-[13px] bg-[#0f0f0f] border border-[#222] px-4 py-3 text-[#7C5CFC]">
          npm run dev
        </div>
        <p>Other available commands:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-mono text-[#7C5CFC]">npm run build</span> — production build</li>
          <li><span className="font-mono text-[#7C5CFC]">npm run lint</span> — ESLint with Next.js + TypeScript rules</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How is the UI built?",
    answer: (
      <div className="space-y-3">
        <p>The stack is purpose-built for performance data visualisation:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-semibold text-[#ccc]">Next.js 15 App Router</span> with Turbopack</li>
          <li><span className="font-semibold text-[#ccc]">Tailwind CSS 4</span> + shadcn/ui (new-york style)</li>
          <li><span className="font-semibold text-[#ccc]">Recharts</span> for all data visualisations</li>
          <li><span className="font-semibold text-[#ccc]">next-themes</span> for dark mode</li>
        </ul>
        <p>
          Components that fetch data or use hooks are marked{" "}
          <span className="font-mono text-[#7C5CFC]">&quot;use client&quot;</span>. Skeleton
          loaders are used while data is in flight.
        </p>
      </div>
    ),
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-[#1a1a1a] last:border-b-0 px-6 md:px-12 lg:px-16">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 py-5 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-[#333] shrink-0 w-6">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[14px] font-medium text-[#888] group-hover:text-white transition-colors tracking-wide">
            {question}
          </span>
        </div>
        <div
          className={`flex size-6 shrink-0 items-center justify-center border border-[#333] bg-[#0f0f0f] transition-transform duration-300 ${
            isOpen ? "rotate-180 border-[#7C5CFC]" : "rotate-0"
          }`}
        >
          <ChevronDown
            className={`size-3.5 transition-colors duration-300 ${
              isOpen ? "text-[#7C5CFC]" : "text-[#555]"
            }`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-[#666] font-mono leading-relaxed text-[13px] pb-8 pl-10 pr-12">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#080808] flex justify-center w-full">
      <div className="container mx-auto border-x border-b border-[#1a1a1a] flex flex-col relative bg-[#0a0a0a]">

        {/* Corner brackets */}
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#444] pointer-events-none" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#444] pointer-events-none" />

        {/* Header */}
        <div className="border-b border-[#1a1a1a] py-16 md:py-20 flex flex-col items-center justify-center text-center px-6 relative bg-[#080808]">
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#7C5CFC] uppercase mb-5">
            FAQs
          </span>
          <h2 className="text-[28px] md:text-[36px] font-serif font-normal leading-tight text-white mb-5">
            Frequently Asked Questions
          </h2>
          <p className="text-[13px] text-[#666] font-mono max-w-[480px] leading-relaxed">
            Everything you need to know about the platform, integrations, and
            data pipeline. Can&apos;t find what you&apos;re looking for? Reach out directly.
          </p>
        </div>

        {/* FAQ list */}
        <div className="w-full relative">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}

          {/* Bottom brackets */}
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#555] pointer-events-none" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#555] pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
