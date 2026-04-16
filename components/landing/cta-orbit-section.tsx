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

export function CtaOrbitSection() {
  const outerD  = 480
  const middleD = 330
  const innerD  = 195

  return (
    <section className="relative bg-[#080808] overflow-hidden">
      <div className="container mx-auto border-x border-b border-[#1a1a1a] relative flex flex-col bg-[#0a0a0a]/30">
        
        {/* Corner Accents */}
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#444] pointer-events-none" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#444] pointer-events-none" />

        <div className="flex flex-col items-center text-center py-24 px-6 relative z-30">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 border border-[#252525] rounded-full px-4 py-1.5 mb-8 bg-[#080808]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
            <span className="text-[10px] text-[#888] tracking-[0.2em] uppercase font-mono">Ecosystem</span>
          </div>

          {/* Heading */}
          <h2 className="text-[32px] md:text-[42px] font-sans font-medium text-white leading-tight mb-6 max-w-2xl">
            Integrate with everything<br />you already use.
          </h2>

          <p className="text-[14px] text-[#666] font-mono leading-relaxed max-w-[500px]">
            Connect Garmin, Whoop, Oura, Polar, Fitbit and 45+ more — 
            all biometric data unified into a single stream.
          </p>
        </div>

        {/* Orbit Visualization */}
        <div className="relative h-[520px] w-full flex items-center justify-center border-t border-[#1a1a1a] bg-[#080808]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C5CFC]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Orbit rings container */}
          <div className="relative" style={{ width: outerD, height: outerD }}>
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
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-[#7C5CFC]/5 animate-pulse" />
                <div className="relative flex items-center justify-center bg-[#0d0d0d] border border-[#252525] rounded-2xl w-14 h-14 shadow-2xl">
                  <div className="w-3 h-3 bg-[#7C5CFC] rounded-sm shadow-[0_0_12px_rgba(124,92,252,0.4)]" />
                </div>
              </div>
            </div>

            <Ring diameter={outerD}  duration="45s" icons={outerIcons}  reverse={false} />
            <Ring diameter={middleD} duration="35s" icons={middleIcons} reverse={true}  />
            <Ring diameter={innerD}  duration="25s" icons={innerIcons}  reverse={false} />
          </div>
        </div>

        {/* Bottom stats row matching the grid style */}
        <div className="grid grid-cols-3 border-t border-[#1a1a1a]">
          {[
            { value: "45+",       label: "Devices"  },
            { value: "Real‑time", label: "Sync"       },
            { value: "No-code",   label: "Setup"      },
          ].map(({ value, label }, i) => (
            <div 
              key={label} 
              className={`flex flex-col items-center py-10 ${i < 2 ? "border-r border-[#1a1a1a]" : ""}`}
            >
              <span className="text-[20px] font-sans font-medium text-white mb-1">{value}</span>
              <span className="text-[10px] text-[#444] font-mono tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Accents */}
        <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#444] pointer-events-none" />
        <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#444] pointer-events-none" />
      </div>
    </section>
  )
}
