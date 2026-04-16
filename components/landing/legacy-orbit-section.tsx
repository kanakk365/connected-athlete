"use client"

import React from "react"

// ─── Brand icon tiles ─────────────────────────────────────────────────────────

function BrandTile({
  abbr,
  bg,
  fg = "#fff",
}: {
  abbr: string
  bg: string
  fg?: string
}) {
  return (
    <div
      className="flex size-11 items-center justify-center rounded-xl"
      style={{ backgroundColor: bg, border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span
        className="text-[8.5px] font-bold font-mono tracking-wider leading-none"
        style={{ color: fg }}
      >
        {abbr}
      </span>
    </div>
  )
}

// Outer ring — 7 icons
const outerIcons = [
  { el: <BrandTile abbr="GRM" bg="#0766AD" />,              label: "Garmin"      },
  { el: <BrandTile abbr="WHP" bg="#E8320A" />,              label: "Whoop"       },
  { el: <BrandTile abbr="OUR" bg="#252540" fg="#A89FFF" />, label: "Oura"        },
  { el: <BrandTile abbr="APL" bg="#1C1C1E" fg="#E5E5E5" />, label: "Apple"       },
  { el: <BrandTile abbr="POL" bg="#C5000D" />,              label: "Polar"       },
  { el: <BrandTile abbr="FIT" bg="#00B0B9" />,              label: "Fitbit"      },
  { el: <BrandTile abbr="COR" bg="#E8600A" />,              label: "Coros"       },
]

// Middle ring — 4 icons
const middleIcons = [
  { el: <BrandTile abbr="STN" bg="#CC1F1A" />,  label: "Suunto"   },
  { el: <BrandTile abbr="SAM" bg="#1428A0" />,  label: "Samsung"  },
  { el: <BrandTile abbr="WTH" bg="#2980B9" />,  label: "Withings" },
  { el: <BrandTile abbr="WAH" bg="#D62828" />,  label: "Wahoo"    },
]

// Inner ring — 2 icons
const innerIcons = [
  { el: <BrandTile abbr="8SL" bg="#1A1A3E" fg="#818CF8" />, label: "Eight Sleep" },
  { el: <BrandTile abbr="GFT" bg="#34A853" />,              label: "Google Fit"  },
]

// ─── Ring component ──────────────────────────────────────────────────────────

interface RingProps {
  diameter: number
  duration: string
  icons: { el: React.ReactNode; label: string }[]
  reverse?: boolean
}

function Ring({ diameter, duration, icons, reverse = false }: RingProps) {
  const r        = diameter / 2
  const ringAnim = reverse ? "animate-counter-orbit" : "animate-orbit"
  const iconAnim = reverse ? "animate-orbit"         : "animate-counter-orbit"

  return (
    <div
      className="absolute"
      style={{
        width: diameter,
        height: diameter,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={`w-full h-full rounded-full ${ringAnim}`}
        style={{ ["--duration" as string]: duration }}
      >
        {icons.map(({ el, label }, i) => {
          const angleDeg = (360 / icons.length) * i
          const angleRad = (angleDeg * Math.PI) / 180
          const x = r * Math.cos(angleRad - Math.PI / 2)
          const y = r * Math.sin(angleRad - Math.PI / 2)

          return (
            <div
              key={`${label}-${i}`}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className={iconAnim}
                style={{ ["--duration" as string]: duration }}
              >
                {el}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function LegacyOrbitSection() {
  const outerD  = 480
  const middleD = 330
  const innerD  = 195

  return (
    <section className="relative bg-[#080808] border-b border-[#1a1a1a] overflow-hidden">
      <div className="container border-x border-[#1a1a1a] relative flex flex-col">

        {/* ── Two-column row ───────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-stretch min-h-[480px]">

        {/* ── Left: Text + CTA ─────────────────────────────────── */}
        <div className="relative z-30 flex flex-col justify-between px-8 lg:px-16 w-full lg:w-[52%] flex-shrink-0">

          {/* Main content — centered vertically */}
          <div className="flex flex-col justify-center flex-1 py-20 lg:py-24">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start border border-[#252525] rounded-full px-3 py-1 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
              <span className="text-[10px] text-[#555] tracking-[0.18em] uppercase font-mono">45+ Device Integrations</span>
            </div>

            {/* Heading */}
            <h2 className="text-[38px] md:text-[54px] font-serif font-normal text-white leading-[1.1] mb-5">
              Every device.<br />One stream.
            </h2>

            {/* Description */}
            <p className="text-[14px] text-[#666] font-mono leading-relaxed max-w-[360px] mb-10">
              Connect Garmin, Whoop, Oura, Polar, Fitbit and 45+ more&nbsp;—
              all biometric data unified into a single platform built for
              performance coaches.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2.5 bg-[#7C5CFC] hover:bg-[#6a4aed] text-white px-7 py-3.5 text-[13px] font-semibold font-sans tracking-wide transition-colors "
              >
                Open Dashboard
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <span className="text-[12px] text-[#444] font-mono">No setup required</span>
            </div>
          </div>

          {/* Stat row — border-t spans full left column width */}
          <div className="border-t border-[#1a1a1a] -mx-8 lg:-mx-16 px-8 lg:px-16 flex items-center gap-0 py-8">
            {[
              { value: "45+",       label: "Wearables"  },
              { value: "Real‑time", label: "Sync"       },
              { value: "Zero",      label: "Setup"      },
            ].map(({ value, label }, i, arr) => (
              <div
                key={label}
                className={`flex flex-col gap-0.5 pr-8 ${i < arr.length - 1 ? "border-r border-[#1a1a1a] mr-8" : ""}`}
              >
                <span className="text-[20px] font-serif text-white">{value}</span>
                <span className="text-[11px] text-[#444] font-mono tracking-wider uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vertical divider ─────────────────────────────────── */}
        <div className="hidden lg:block w-px bg-[#1a1a1a] flex-shrink-0" />

        {/* ── Right: Orbit animation ────────────────────────────── */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[360px] lg:min-h-0">

          {/* Edge fades — right, top, bottom */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: [
                "linear-gradient(to right,  #080808 0%, transparent 18%)",
                "linear-gradient(to left,   #080808 0%, transparent 22%)",
                "linear-gradient(to bottom, #080808 0%, transparent 20%)",
                "linear-gradient(to top,    #080808 0%, transparent 20%)",
              ].join(", "),
            }}
          />

          {/* Orbit container — slightly overflows to give depth */}
          <div
            className="absolute"
            style={{
              width: outerD,
              height: outerD,
              top: "50%",
              left: "50%",
              transform: "translate(-44%, -50%)",
            }}
          >
            {/* Ring tracks */}
            {[outerD, middleD, innerD].map(d => (
              <div
                key={d}
                className="absolute rounded-full border border-[#1e1e1e]"
                style={{
                  width: d,
                  height: d,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Center hub */}
            <div
              className="absolute"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-[#7C5CFC]/8 animate-ping" style={{ animationDuration: "2.8s" }} />
                <div className="absolute w-14 h-14 rounded-full bg-[#7C5CFC]/12" />
                <div className="absolute w-10 h-10 rounded-full bg-[#7C5CFC]/6" />
                <div className="relative flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 shadow-[0_0_24px_rgba(124,92,252,0.15)]">
                  <div className="w-2 h-2 bg-[#7C5CFC] shrink-0 rounded-sm" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase font-sans">CA</span>
                </div>
              </div>
            </div>

            <Ring diameter={outerD}  duration="38s" icons={outerIcons}  reverse={false} />
            <Ring diameter={middleD} duration="26s" icons={middleIcons} reverse={true}  />
            <Ring diameter={innerD}  duration="17s" icons={innerIcons}  reverse={false} />
          </div>
        </div>

        </div>{/* ── end two-column row ── */}

      </div>
    </section>
  )
}
