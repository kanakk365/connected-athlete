"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

/* ─── data ─── */
const FEATURES = [
  {
    number: "01",
    title: "UNIFIED WEARABLE DATA",
    desc: "Connect Garmin, Whoop, Apple Watch, Oura Ring and 50+ devices into one real-time stream. Zero fragmentation.",
    stat: "50+ DEVICES",
  },
  {
    number: "02",
    title: "READINESS & RECOVERY",
    desc: "Deep HRV analysis, sleep stages, training load and recovery scores synthesised into actionable daily readiness.",
    stat: "< 1 SEC LATENCY",
  },
  {
    number: "03",
    title: "LIVE PERFORMANCE STREAMS",
    desc: "Coach and athlete share the same live dashboard during sessions. Real-time biometric overlays on video.",
    stat: "REAL-TIME",
  },
  {
    number: "04",
    title: "NUTRITION & BODY METRICS",
    desc: "Track macros, hydration, and body composition trends correlated directly against performance output data.",
    stat: "FULL STACK",
  },
]

const STATS = [
  { value: "2.4M+", label: "ATHLETE SESSIONS TRACKED" },
  { value: "98.7%", label: "UPTIME SLA" },
  { value: "50+",   label: "WEARABLE INTEGRATIONS" },
  { value: "< 80ms", label: "AVERAGE RESPONSE TIME" },
]

const INTEGRATIONS = [
  "GARMIN", "WHOOP", "APPLE WATCH", "OURA", "POLAR", "FITBIT",
  "SAMSUNG", "SUUNTO", "WAHOO", "COROS", "WITHINGS", "BIOSTRAP",
]

const TESTIMONIALS = [
  {
    quote: "Connected Athlete eliminated the data silos across our entire squad. Every metric, every device, one source of truth.",
    author: "MARCUS CHEN",
    role: "HEAD OF PERFORMANCE / FC METRO",
  },
  {
    quote: "The real-time biometric streaming during training sessions changed how we coach. Decisions are instant now.",
    author: "SARAH OKONKWO",
    role: "SPORTS SCIENTIST / ELITE TRACK CLUB",
  },
  {
    quote: "The API integration is the most robust we've used. Onboarding took minutes, not weeks.",
    author: "DR. JAMES WRIGHT",
    role: "CTO / PERFORMANCE LAB INC.",
  },
]

const METRICS = [
  { label: "SLEEP SCORE", val: "91", unit: "/100", cls: "text-[#a78bfa]" },
  { label: "READINESS",   val: "84", unit: "%",    cls: "text-[#7C5CFC]" },
  { label: "RESTING HR",  val: "52", unit: "BPM",  cls: "text-[#4ade80]" },
  { label: "LOAD INDEX",  val: "6.2", unit: "ATL", cls: "text-[#e879f9]" },
]

/* ─── page ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeT, setActiveT]   = useState(0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveT((p) => (p + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="bg-[#080808] text-[#e8e8e8] min-h-screen  overflow-x-hidden">

      {/* ══  NAV  ══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? "bg-[#080808]/95 border-b border-[#1a1a1a]" : "bg-transparent"
        }`}
      >
        <div className="px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-[#7C5CFC] shrink-0" />
            <span className="text-[13px] font-extrabold tracking-[0.18em] text-white uppercase">
              CONNECTED ATHLETE
            </span>
          </div>

          <div className="flex items-center gap-9">
            {["PLATFORM", "INTEGRATIONS", "DEVELOPERS", "PRICING"].map((item) => (
              <span
                key={item}
                className="text-[11px] font-medium tracking-[0.12em] text-[#555] hover:text-white transition-colors cursor-pointer"
              >
                {item}
              </span>
            ))}
            <Link
              href="/dashboard"
              className="text-[11px] font-bold tracking-[0.14em] bg-[#7C5CFC] text-white px-[22px] py-2.5 hover:opacity-80 transition-opacity"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      {/* ══  HERO  ══ */}
      <section className="border-b border-[#1a1a1a] pt-16 overflow-hidden">
        <div className="grid grid-cols-2">

          {/* left column */}
          <div className="px-10 py-20 border-r border-[#1a1a1a] flex flex-col justify-between min-h-[calc(100vh-64px)]">
            <div>
              {/* live badge */}
              <div className="inline-flex items-center gap-2 border border-[#1e1e1e] px-3.5 py-1.5 mb-16">
                <div className="w-1.5 h-1.5 bg-[#7C5CFC] rounded-full animate-pulse" />
                <span className="text-[10px] tracking-[0.18em] text-[#555]">
                  LIVE PLATFORM — v2.0
                </span>
              </div>

              {/* headline */}
              <h1 className="text-[clamp(52px,6vw,88px)] font-black leading-[0.9] tracking-[-0.04em] uppercase text-white mb-10">
                THE
                ATHLETE
                <br /><span className="text-[#7C5CFC]">DATA </span>
                OS
              </h1>

              <p className="text-[15px] leading-[1.7] text-[#555] max-w-[380px] mb-12">
                One unified platform aggregating biometric data from every wearable.
                Built for performance coaches who demand precision, not approximation.
              </p>

              <div className="flex items-center gap-5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 bg-[#7C5CFC] text-white px-8 py-4 font-bold text-[12px] tracking-[0.14em] hover:opacity-80 transition-opacity"
                >
                  OPEN DASHBOARD
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
                <span className="text-[11px] text-[#3a3a3a] tracking-[0.1em] cursor-pointer hover:text-[#777] transition-colors">
                  VIEW API DOCS →
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-12">
              <div className="w-8 h-px bg-[#1e1e1e]" />
              <span className="text-[10px] tracking-[0.2em] text-[#2e2e2e]">
                SWISS PRECISION · GLOBAL SCALE
              </span>
            </div>
          </div>

          {/* right column — live metrics */}
          <div className="relative overflow-hidden bg-[#0b0b0b] min-h-[calc(100vh-64px)]">
            <div className="absolute inset-0 bg-grid opacity-80" />
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-0.5 p-10">

              {/* HRV card */}
              <div className="w-full max-w-[360px] bg-[#0f0f0f] border border-[#1e1e1e] p-6">
                <div className="flex justify-between mb-4">
                  <span className="text-[10px] tracking-[0.16em] text-[#3a3a3a]">HRV SCORE</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-[#7C5CFC] rounded-full" />
                    <span className="text-[10px] text-[#3a3a3a] tracking-[0.1em]">LIVE</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[52px] font-black text-white leading-none tracking-[-0.04em]">78</span>
                  <span className="text-[13px] text-[#3a3a3a]">MS</span>
                  <span className="text-[12px] text-[#4ade80] ml-auto">↑ 4.2%</span>
                </div>
                <svg width="100%" height="38" viewBox="0 0 320 38" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7C5CFC" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="0,30 40,22 80,28 120,15 160,20 200,10 240,18 280,8 320,12"
                    fill="none"
                    stroke="url(#lg)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* metric cards */}
              <div className="w-full max-w-[360px] grid grid-cols-2 gap-0.5">
                {METRICS.map((m) => (
                  <div key={m.label} className="bg-[#0f0f0f] border border-[#1e1e1e] p-4">
                    <div className="text-[9px] tracking-[0.16em] text-[#2e2e2e] mb-2">{m.label}</div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-[28px] font-black tracking-[-0.03em] ${m.cls}`}>{m.val}</span>
                      <span className="text-[10px] text-[#2e2e2e]">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* device row */}
              <div className="w-full max-w-[360px] bg-[#0f0f0f] border border-[#1e1e1e] px-5 py-4 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.14em] text-[#3a3a3a]">CONNECTED DEVICES</span>
                <div className="flex gap-1.5">
                  {["GRM", "OUR", "APL", "WHO"].map((d) => (
                    <div
                      key={d}
                      className="text-[9px] tracking-[0.1em] text-[#7C5CFC] bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-2 py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══  STATS  ══ */}
      <section className="border-b border-[#1a1a1a]">
        <div className="grid grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`py-12 px-10 ${i < 3 ? "border-r border-[#1a1a1a]" : ""}`}>
              <div
                className={`text-[clamp(32px,3.5vw,52px)] font-black tracking-[-0.04em] leading-none mb-2 ${
                  i === 0 ? "text-[#7C5CFC]" : "text-white"
                }`}
              >
                {s.value}
              </div>
              <div className="text-[10px] tracking-[0.16em] text-[#2e2e2e]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══  FEATURES  ══ */}
      <section className="border-b border-[#1a1a1a]">
        {/* header */}
        <div className="border-b border-[#1a1a1a] px-10 py-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-0.5 bg-[#7C5CFC]" />
            <span className="text-[10px] tracking-[0.2em] text-[#3a3a3a]">CORE CAPABILITIES</span>
          </div>
          <span className="text-[10px] tracking-[0.1em] text-[#252525]">04 MODULES</span>
        </div>

        {FEATURES.map((f, i) => (
          <div
            key={f.number}
            className={`grid grid-cols-[72px_1fr_160px] hover:bg-[#7C5CFC]/[0.04] transition-colors ${
              i < FEATURES.length - 1 ? "border-b border-[#1a1a1a]" : ""
            }`}
          >
            <div className="border-r border-[#1a1a1a] px-6 pt-11 pb-10">
              <span className="text-[12px] font-bold tracking-[0.1em] text-[#7C5CFC]">{f.number}</span>
            </div>
            <div className="px-14 py-10">
              <h3 className="text-[22px] font-extrabold tracking-[-0.02em] uppercase text-white mb-3.5 mt-0">
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#444] m-0 max-w-[480px]">{f.desc}</p>
            </div>
            <div className="border-l border-[#1a1a1a] px-8 py-10 flex items-end justify-end">
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#222] text-right">{f.stat}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ══  INTEGRATIONS MARQUEE  ══ */}
      <section className="border-b border-[#1a1a1a] overflow-hidden">
        <div className="border-b border-[#1a1a1a] px-10 py-[18px] flex items-center gap-4">
          <div className="w-6 h-0.5 bg-[#7C5CFC]" />
          <span className="text-[10px] tracking-[0.2em] text-[#3a3a3a]">SUPPORTED INTEGRATIONS</span>
        </div>
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {[...INTEGRATIONS, ...INTEGRATIONS].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="px-[52px] py-7 border-r border-[#161616] text-[11px] font-bold tracking-[0.18em] text-[#222] hover:text-[#7C5CFC] transition-colors cursor-default shrink-0"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* ══  TESTIMONIALS  ══ */}
      <section className="border-b border-[#1a1a1a]">
        <div className="grid grid-cols-[260px_1fr]">

          {/* sidebar */}
          <div className="border-r border-[#1a1a1a] px-10 py-16 flex flex-col justify-between">
            <div>
              <div className="w-6 h-0.5 bg-[#7C5CFC] mb-6" />
              <span className="text-[10px] tracking-[0.2em] text-[#3a3a3a] block mb-8">FIELD REPORTS</span>
              <h2 className="text-[36px] font-black tracking-[-0.04em] uppercase leading-[0.95] text-white m-0">
                FROM THE<br />FRONT<br /><span className="text-[#7C5CFC]">LINE</span>
              </h2>
            </div>
            <div className="flex gap-2 mt-10">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveT(i)}
                  className={`h-0.5 border-none cursor-pointer p-0 transition-all duration-300 ${
                    i === activeT ? "w-7 bg-[#7C5CFC]" : "w-2 bg-[#252525]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* quote area */}
          <div className="px-[72px] py-20 relative overflow-hidden min-h-[340px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-[600ms] ease-in-out ${
                  i === activeT
                    ? "relative opacity-100 translate-y-0 pointer-events-auto"
                    : "absolute opacity-0 translate-y-5 pointer-events-none top-20 left-[72px] right-[72px]"
                }`}
              >
                <div className="text-[64px] leading-none text-[#7C5CFC] font-black mb-6 opacity-30">&ldquo;</div>
                <blockquote className="text-[19px] leading-[1.65] text-[#aaa] font-normal m-0 mb-10 max-w-[560px]">
                  {t.quote}
                </blockquote>
                <div>
                  <div className="text-[12px] font-bold tracking-[0.1em] text-white mb-1">{t.author}</div>
                  <div className="text-[10px] tracking-[0.16em] text-[#333]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══  CTA  ══ */}
      <section className="border-b border-[#1a1a1a]">
        <div className="grid grid-cols-2 min-h-[420px]">

          {/* purple panel */}
          <div className="bg-[#7C5CFC] px-16 py-20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-white/40 block mb-9 uppercase">Start Now</span>
              <h2 className="text-[clamp(38px,4vw,60px)] font-black tracking-[-0.04em] uppercase leading-[0.9] text-white m-0">
                UNIFY YOUR<br />ATHLETE<br />DATA TODAY
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-[#080808] text-white px-9 py-[18px] font-bold text-[12px] tracking-[0.14em] self-start mt-12 hover:bg-[#161616] transition-colors"
            >
              LAUNCH DASHBOARD
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          </div>

          {/* dev panel */}
          <div className="bg-[#0b0b0b] px-16 py-20 flex flex-col justify-between border-l border-[#1a1a1a]">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#2a2a2a] block mb-9 uppercase">For Developers</span>
              <h2 className="text-[clamp(38px,4vw,60px)] font-black tracking-[-0.04em] uppercase leading-[0.9] text-white m-0 mb-6">
                BUILD ON<br />OUR<br />PLATFORM
              </h2>
              <p className="text-[14px] leading-[1.7] text-[#3a3a3a] max-w-[300px]">
                REST & WebSocket APIs with OAuth flows for every major wearable.
                SDKs for Python, Node, Swift & Kotlin.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-3 border border-[#222] text-[#555] px-9 py-[18px] font-bold text-[12px] tracking-[0.14em] self-start mt-12 hover:border-[#7C5CFC] hover:text-[#7C5CFC] transition-all"
            >
              VIEW DOCS
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══  FOOTER  ══ */}
      <footer className="border-t border-[#121212] px-10 py-9 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#7C5CFC]" />
          <span className="text-[11px] font-bold tracking-[0.18em] text-[#252525]">CONNECTED ATHLETE</span>
        </div>
        <span className="text-[10px] tracking-[0.1em] text-[#252525]">© 2026 — ALL RIGHTS RESERVED</span>
      </footer>

    </main>
  )
}
