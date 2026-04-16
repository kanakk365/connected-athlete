"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Connected Athlete?",
    answer: (
      <div className="space-y-3">
        <p>
          Connected Athlete is a unified performance OS for coaches and athletes.
          It aggregates biometric data from 50+ wearable devices into one
          real-time stream — giving coaches a single source of truth across their
          entire roster.
        </p>
        <div className="space-y-2">
          <p className="font-semibold text-[#ccc]">The platform includes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>A live performance dashboard with per-athlete detail views</li>
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
          Connected Athlete works with 50+ of the world&apos;s most popular
          fitness and health wearables, including:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Garmin, Whoop, Apple Watch, Oura Ring, Polar, Fitbit</li>
          <li>Suunto, Coros, Withings, Wahoo, Samsung Health, Google Fit</li>
          <li>Eight Sleep, Biostrap, Peloton, Zwift, Concept2, and more</li>
        </ul>
        <p>
          New device integrations are added regularly and become available to
          all users automatically — no updates required on your end.
        </p>
      </div>
    ),
  },
  {
    question: "How does data syncing work?",
    answer: (
      <div className="space-y-3">
        <p>
          Once an athlete connects their wearable, data begins flowing into their
          dashboard automatically. Syncs happen in the background throughout the
          day — no manual refreshes needed.
        </p>
        <p>
          Historical data is also imported on first connection, so coaches have
          full trend context from day one — not just data going forward.
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
          Yes. The sidebar lists every athlete on your roster. Each athlete has
          a dedicated profile with their full biometric history and a live
          performance dashboard you can access instantly.
        </p>
        <p>
          Coaches can switch between athletes without leaving the dashboard —
          ideal for managing large squads or remote training groups.
        </p>
      </div>
    ),
  },
  {
    question: "How do I connect my wearable device?",
    answer: (
      <div className="space-y-3">
        <p>
          Connecting is a one-time, two-step process:
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Open the dashboard and click <span className="text-[#ccc] font-semibold">Add Device</span></li>
          <li>Select your wearable from the list and authorise access — takes under 60 seconds</li>
        </ol>
        <p>
          Once authorised, your device syncs automatically. There are no cables,
          no manual exports, and no recurring setup steps.
        </p>
      </div>
    ),
  },
  {
    question: "Is my health data secure and private?",
    answer: (
      <div className="space-y-3">
        <p>
          All biometric data is encrypted in transit and at rest. Athlete data
          is scoped to the coach and athlete — no data is shared across
          organisations or used to train models.
        </p>
        <p>
          Athletes retain full ownership of their data and can revoke device
          access at any time from the dashboard. Coaches only see data for
          athletes who have explicitly authorised the connection.
        </p>
      </div>
    ),
  },
  {
    question: "What does the readiness score measure?",
    answer: (
      <div className="space-y-3">
        <p>
          The daily readiness score is a composite metric synthesised from an
          athlete&apos;s most recent biometric data. It weighs:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-semibold text-[#ccc]">HRV</span> — heart rate variability relative to personal baseline</li>
          <li><span className="font-semibold text-[#ccc]">Sleep quality</span> — stage distribution and efficiency score</li>
          <li><span className="font-semibold text-[#ccc]">Training load</span> — cumulative stress from recent sessions</li>
          <li><span className="font-semibold text-[#ccc]">Resting heart rate</span> — deviation from 7-day average</li>
        </ul>
        <p>
          A score above 80 indicates full readiness for high-intensity work.
          Below 60 signals the athlete needs recovery-focused training.
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
