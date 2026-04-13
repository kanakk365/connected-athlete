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
  { el: <BrandTile abbr="GRM" bg="#0766AD" />,           label: "Garmin"      },
  { el: <BrandTile abbr="WHP" bg="#E8320A" />,           label: "Whoop"       },
  { el: <BrandTile abbr="OUR" bg="#252540" fg="#A89FFF" />, label: "Oura"     },
  { el: <BrandTile abbr="APL" bg="#1C1C1E" fg="#E5E5E5" />, label: "Apple"   },
  { el: <BrandTile abbr="POL" bg="#C5000D" />,           label: "Polar"       },
  { el: <BrandTile abbr="FIT" bg="#00B0B9" />,           label: "Fitbit"      },
  { el: <BrandTile abbr="COR" bg="#E8600A" />,           label: "Coros"       },
]

// Middle ring — 4 icons
const middleIcons = [
  { el: <BrandTile abbr="STN" bg="#CC1F1A" />,           label: "Suunto"      },
  { el: <BrandTile abbr="SAM" bg="#1428A0" />,           label: "Samsung"     },
  { el: <BrandTile abbr="WTH" bg="#2980B9" />,           label: "Withings"    },
  { el: <BrandTile abbr="WAH" bg="#D62828" />,           label: "Wahoo"       },
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
  const r = diameter / 2
  const ringAnim  = reverse ? "animate-counter-orbit" : "animate-orbit"
  const iconAnim  = reverse ? "animate-orbit"         : "animate-counter-orbit"

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

export function CtaOrbitSection() {
  const outerD   = 540
  const middleD  = 370
  const innerD   = 220

  const containerSize  = outerD
  const visibleHeight  = containerSize * 0.30

  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-[#080808] border-b border-[#1a1a1a]">
      <div className="container border-x border-[#1a1a1a] relative flex flex-col items-center overflow-hidden">

        {/* Fade: orbit bleeds into text below */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, #080808 0%, transparent 18%, transparent 40%, #080808 75%)" }}
        />

        {/* Orbit area — only top slice is visible */}
        <div className="relative flex-shrink-0 w-full" style={{ height: visibleHeight }}>
          <div
            className="absolute"
            style={{
              width: containerSize,
              height: containerSize,
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Ring track circles */}
            {[outerD, middleD, innerD].map(d => (
              <div
                key={d}
                className="absolute rounded-full border border-[#1a1a1a]"
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
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Pulse ring */}
                <div className="absolute w-16 h-16 rounded-full bg-[#7C5CFC]/10 animate-ping" style={{ animationDuration: "2.4s" }} />
                <div className="absolute w-11 h-11 rounded-full bg-[#7C5CFC]/15" />
                {/* Core */}
                <div className="relative flex items-center justify-center gap-2 bg-[#080808] border border-[#2a2a2a] rounded-xl px-3 py-2">
                  <div className="w-2 h-2 bg-[#7C5CFC] shrink-0 rounded-sm" />
                  <span className="text-[10px] font-bold tracking-[0.18em] text-white uppercase font-sans">CA</span>
                </div>
              </div>
            </div>

            <Ring diameter={outerD}  duration="38s" icons={outerIcons}  reverse={false} />
            <Ring diameter={middleD} duration="26s" icons={middleIcons} reverse={true}  />
            <Ring diameter={innerD}  duration="17s" icons={innerIcons}  reverse={false} />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="relative z-30 flex flex-col items-center text-center px-6 pb-20 -mt-4">
          <h2 className="text-[36px] md:text-[52px] font-serif font-normal text-white leading-[1.15] max-w-2xl">
            Every device.<br className="hidden md:block" /> One stream.
          </h2>
          <p className="mt-4 text-[14px] text-[#777] font-sans max-w-md leading-relaxed">
            Connect Garmin, Whoop, Oura, Polar, Fitbit and 45+ more — all data flows into a single unified platform.
          </p>
          <a
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2.5 bg-[#7C5CFC] hover:bg-[#6a4aed] text-white px-7 py-3 text-[13px] font-semibold font-sans tracking-wide transition-colors rounded-xl"
          >
            Open Dashboard
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
