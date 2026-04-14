"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useInView } from "motion/react"
import { Activity, Cpu, MessageSquare, Wifi } from "lucide-react"

// ─── CARD 1: LIVE DATA FEED (40%) ────────────────────────────────────────────

const streamRows = [
  { src: "GARMIN",  key: "HRV",      val: "68 ms",  tag: "+4",    up: true  },
  { src: "WHOOP",   key: "RECOVERY", val: "84 %",   tag: "+11%",  up: true  },
  { src: "OURA",    key: "SLEEP",    val: "7h 42m", tag: "+18m",  up: true  },
  { src: "APPLE",   key: "SPO₂",    val: "98 %",   tag: "stable", up: null  },
  { src: "GARMIN",  key: "VO₂MAX",  val: "52.4",   tag: "+0.2",  up: true  },
  { src: "POLAR",   key: "STRESS",   val: "34",     tag: "−8",    up: false },
]

function DataFeedCard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let cancelled = false
    function runCycle() {
      if (cancelled) return
      setVisibleRows([])
      streamRows.forEach((_, i) => {
        setTimeout(() => {
          if (cancelled) return
          setVisibleRows(p => [...p, i])
        }, 500 + i * 260)
      })
      setTimeout(() => {
        if (!cancelled) { setTick(t => t + 1); runCycle() }
      }, 500 + streamRows.length * 260 + 2200)
    }
    runCycle()
    return () => { cancelled = true }
  }, [isInView])

  return (
    <div ref={ref} className="h-[440px] lg:h-[500px] w-full p-7 flex flex-col justify-between bg-[#080808]">
      {/* Terminal box */}
      <div className="flex-1 flex flex-col justify-center rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] px-5 py-4 font-mono text-[11px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[#666] tracking-[0.18em] uppercase text-[10px]">live stream</span>
          <span className="ml-auto text-[#555] tabular-nums text-[10px]">
            {new Date().toISOString().slice(11, 19)}
          </span>
        </div>

        {/* Column labels */}
        <div className="flex items-center gap-3 mb-2 text-[9px] text-[#555] tracking-[0.14em] uppercase">
          <span className="w-12 shrink-0">Source</span>
          <span className="w-16 shrink-0">Metric</span>
          <span className="ml-auto">Value</span>
          <span className="w-12 text-right">Delta</span>
        </div>

        {/* Rows */}
        {streamRows.map((row, i) => (
          <motion.div
            key={`${tick}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={visibleRows.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex items-center gap-3 py-[6px] border-b border-[#111] last:border-0"
          >
            <span className="text-[#666] w-12 shrink-0">{row.src}</span>
            <span className="text-[#777] w-16 shrink-0">{row.key}</span>
            <span className="text-white ml-auto font-medium">{row.val}</span>
            <span className={`w-12 text-right ${row.up === true ? "text-[#7C5CFC]" : row.up === false ? "text-[#555]" : "text-[#555]"}`}>
              {row.tag}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Label */}
      <div className="mt-5">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC]">
            <Activity size={14} />
          </div>
          <h3 className="text-[14px] font-semibold text-white font-sans tracking-tight">
            Live Data Ingestion
          </h3>
        </div>
        <p className="text-[12px] text-[#777] font-sans leading-relaxed">
          Real-time biometric stream from every connected device, unified into one pipeline.
        </p>
      </div>
    </div>
  )
}

// ─── CARD 2: ATHLETE ↔ AI CHAT (60%) ─────────────────────────────────────────

const chatMessages = [
  { text: "HRV down 12% from baseline — three hard days are stacking fatigue.", role: "ai" as const, delay: 0 },
  { text: "Should I still hit threshold today?", role: "athlete" as const, delay: 3.4 },
  { text: "Skip it. Resting HR is up 6 bpm and sleep efficiency was only 71% last night.", role: "ai" as const, delay: 6.2 },
  { text: "Zone 2 only then. What's my outlook for Saturday's race?", role: "athlete" as const, delay: 10.0 },
  { text: "Trend is positive. Sleep 8h tonight and you'll peak at 89+ readiness by race day.", role: "ai" as const, delay: 13.0 },
]

function TypingText({ text, cycleKey }: { text: string; cycleKey: number }) {
  return (
    <motion.span
      key={cycleKey}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.022 }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 5, filter: "blur(5px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.16 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

function ChatCard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-80px" })
  const [visibleMessages, setVisibleMessages] = useState<typeof chatMessages>([])
  const [cycleKey, setCycleKey] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let cancelled = false

    function runCycle(key: number) {
      if (cancelled) return
      setVisibleMessages([])
      chatMessages.forEach(msg => {
        setTimeout(() => {
          if (cancelled) return
          setVisibleMessages(prev =>
            prev.find(m => m.text === msg.text) ? prev : [...prev, msg]
          )
        }, msg.delay * 1000)
      })
      const lastMsg = chatMessages[chatMessages.length - 1]
      const cycleEnd = lastMsg.delay * 1000 + lastMsg.text.length * 22 + 2200
      setTimeout(() => {
        if (!cancelled) { setCycleKey(key + 1); runCycle(key + 1) }
      }, cycleEnd)
    }

    runCycle(0)
    return () => { cancelled = true }
  }, [isInView])

  return (
    <div ref={containerRef} className="h-[440px] lg:h-[500px] w-full p-7 flex flex-col justify-between bg-[#080808]">
      {/* Message area */}
      <div className="flex-1 relative overflow-hidden flex flex-col justify-end pb-2">
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#080808] to-transparent z-20 pointer-events-none" />

        <div className="flex flex-col gap-3 w-full">
          {visibleMessages.map((msg, idx) => (
            <motion.div
              key={`${cycleKey}-${idx}`}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex items-end gap-2 ${msg.role === "athlete" ? "justify-end" : "justify-start"}`}
            >
              {/* AI avatar */}
              {msg.role === "ai" && (
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 flex items-center justify-center mb-0.5">
                  <span className="text-[7px] font-sans font-semibold text-[#7C5CFC]">AI</span>
                </div>
              )}

              <div className={`relative max-w-[82%] px-4 py-2.5 text-[13px] leading-[1.6] font-sans
                ${msg.role === "athlete"
                  ? "bg-[#7C5CFC] text-white rounded-2xl rounded-tr-sm"
                  : "bg-[#111] border border-[#1e1e1e] text-[#aaa] rounded-2xl rounded-tl-sm"
                }`}
              >
                <TypingText text={msg.text} cycleKey={cycleKey} />
              </div>

              {/* Athlete avatar */}
              {msg.role === "athlete" && (
                <div className="w-6 h-6 shrink-0 rounded-full border border-[#333] bg-[#161616] flex items-center justify-center mb-0.5">
                  <span className="text-[7px] font-sans font-semibold text-[#888]">ATH</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="mt-5 pt-4 border-t border-[#111]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC]">
            <MessageSquare size={14} />
          </div>
          <h3 className="text-[14px] font-semibold text-white font-sans tracking-tight">
            AI Coaching Copilot
          </h3>
        </div>
        <p className="text-[12px] text-[#777] font-sans leading-relaxed">
          Ask anything. The AI reads your live biometrics and coaches you in real time.
        </p>
      </div>
    </div>
  )
}

// ─── CARD 3: WEARABLE HUB (60%) ──────────────────────────────────────────────

const leftDevices  = [
  { name: "GARMIN", types: "STEPS · GPS · HR", y: 46 },
  { name: "WHOOP",  types: "HRV · STRAIN",     y: 110 },
  { name: "OURA",   types: "SLEEP · TEMP",     y: 174 },
]
const rightDevices = [
  { name: "APPLE",  types: "SPO₂ · ECG",       y: 46  },
  { name: "POLAR",  types: "POWER · HR",        y: 110 },
  { name: "FITBIT", types: "ACTIVITY · CALS",  y: 174 },
]

const HUB_CX = 232
const HUB_CY = 118

function leftBeamPath(deviceY: number) {
  const sx = 92, sy = deviceY + 14, ex = HUB_CX - 34, ey = HUB_CY
  return `M ${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`
}
function rightBeamPath(deviceY: number) {
  const sx = 372, sy = deviceY + 14, ex = HUB_CX + 34, ey = HUB_CY
  return `M ${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`
}

function DeviceRect({ x, y, name, types, delay }: {
  x: number; y: number; name: string; types: string; delay: number
}) {
  return (
    <g>
      <rect x={x} y={y} width={92} height={28} rx={6} fill="#0f0f0f" stroke="#222" strokeWidth="1" />
      <motion.rect
        x={x} y={y} width={92} height={28} rx={6}
        fill="none" stroke="#7C5CFC" strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, delay, times: [0, 0.2, 0.7, 1] }}
      />
      <text x={x + 46} y={y + 11} textAnchor="middle"
        fill="#aaa" fontSize="7" fontFamily="monospace" letterSpacing="0.08em" fontWeight="500">
        {name}
      </text>
      <text x={x + 46} y={y + 22} textAnchor="middle"
        fill="#555" fontSize="5.5" fontFamily="monospace" letterSpacing="0.05em">
        {types}
      </text>
    </g>
  )
}

function DataBeam({ d, delay }: { d: string; delay: number }) {
  return (
    <>
      <path d={d} stroke="#1a1a1a" strokeWidth="1" fill="none" />
      <motion.path
        d={d} stroke="#7C5CFC" strokeWidth="1.2" fill="none"
        strokeLinecap="round" strokeDasharray="5 14"
        animate={{ strokeDashoffset: [76, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay }}
        opacity={0.4}
      />
      <motion.path
        d={d} stroke="#7C5CFC" strokeWidth="1.5" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, delay, times: [0, 0.35, 0.65, 1], ease: "easeInOut" }}
      />
    </>
  )
}

function WearableHubCard() {
  return (
    <div className="h-[440px] lg:h-[500px] w-full px-7 pt-5 pb-6 flex flex-col justify-between bg-[#080808]">
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 464 236" className="w-full" style={{ height: "280px" }}>
          <defs>
            <radialGradient id="wh-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <motion.circle cx={HUB_CX} cy={HUB_CY} r="56" fill="url(#wh-glow)"
            animate={{ r: [48, 62, 48], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Beams */}
          {leftDevices.map((d, i)  => <DataBeam key={`l-${d.name}`} d={leftBeamPath(d.y)}  delay={i * 0.55} />)}
          {rightDevices.map((d, i) => <DataBeam key={`r-${d.name}`} d={rightBeamPath(d.y)} delay={0.28 + i * 0.55} />)}

          {/* Device nodes */}
          {leftDevices.map((d, i)  => <DeviceRect key={d.name} x={0}   y={d.y} name={d.name} types={d.types} delay={i * 0.55} />)}
          {rightDevices.map((d, i) => <DeviceRect key={d.name} x={372} y={d.y} name={d.name} types={d.types} delay={0.28 + i * 0.55} />)}

          {/* Hub */}
          <circle cx={HUB_CX} cy={HUB_CY} r="34" fill="#0d0d0d" stroke="#222" strokeWidth="1" />
          <motion.circle cx={HUB_CX} cy={HUB_CY} r="22"
            fill="none" stroke="#7C5CFC" strokeWidth="0.8"
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <text x={HUB_CX} y={HUB_CY - 4} textAnchor="middle"
            fill="#888" fontSize="6" fontFamily="sans-serif" letterSpacing="0.08em" fontWeight="600">
            CONNECTED
          </text>
          <text x={HUB_CX} y={HUB_CY + 6} textAnchor="middle"
            fill="#888" fontSize="6" fontFamily="sans-serif" letterSpacing="0.08em" fontWeight="600">
            ATHLETE
          </text>
          <text x={HUB_CX} y={HUB_CY + 16} textAnchor="middle"
            fill="#555" fontSize="5" fontFamily="monospace">
            HUB
          </text>
        </svg>
      </div>

      {/* Label */}
      <div className="mt-2">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC]">
            <Wifi size={14} />
          </div>
          <h3 className="text-[14px] font-semibold text-white font-sans tracking-tight">
            Unified Wearable Hub
          </h3>
        </div>
        <p className="text-[12px] text-[#777] font-sans leading-relaxed">
          Garmin, Whoop, Oura, Apple, Polar, Fitbit — all devices, one ingestion layer.
        </p>
      </div>
    </div>
  )
}

// ─── CARD 4: NEURAL PERFORMANCE ENGINE (40%) ─────────────────────────────────

function NeuralEngineCard() {
  const [pulse, setPulse] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[440px] lg:h-[500px] w-full p-7 flex flex-col justify-between bg-[#080808] relative overflow-hidden group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Central Core */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Pulsing Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-[#7C5CFC]/30 rounded-full"
              initial={{ width: 60, height: 60, opacity: 0.8 }}
              animate={{ 
                width: [60, 180], 
                height: [60, 180], 
                opacity: [0.8, 0],
                borderWidth: [2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 1,
                ease: "easeOut" 
              }}
            />
          ))}

          {/* Inner Glowing Hexagon/Circle */}
          <div className="w-20 h-20 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/50 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(124,92,252,0.2)]">
            <motion.div 
              className="text-[#7C5CFC]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cpu size={32} />
            </motion.div>
            
            {/* Spinning ring around core */}
            <motion.div 
              className="absolute inset-0 border-t-2 border-r-2 border-[#7C5CFC] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Floating Data Bits */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const r = 85 + Math.sin(pulse * 0.1 + i) * 5
            const x = Math.cos(angle * (Math.PI / 180)) * r
            const y = Math.sin(angle * (Math.PI / 180)) * r
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#7C5CFC] rounded-full"
                style={{ x, y }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            )
          })}
        </div>

      </div>

      {/* Label */}
      <div className="mt-5 relative z-10">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-1.5 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#7C5CFC]">
            <Cpu size={14} />
          </div>
          <h3 className="text-[14px] font-semibold text-white font-sans tracking-tight">
            Readiness Engine
          </h3>
        </div>
        <p className="text-[12px] text-[#777] font-sans leading-relaxed">
          HRV, sleep, training load and recovery data synthesised into a single daily readiness score for every athlete.
        </p>
      </div>
    </div>
  )
}

// ─── SECTION ─────────────────────────────────────────────────────────────────

export function BentoSection() {
  return (
    <section className="bg-[#080808] flex justify-center w-full">
      <div className="container mx-auto border-x border-b border-[#1a1a1a] flex flex-col relative">
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#444] pointer-events-none z-10" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#444] pointer-events-none z-10" />

        {/* Section header */}
        <div className="border-b border-[#1a1a1a] py-16 md:py-20 flex flex-col items-center justify-center text-center px-6 bg-[#080808]">
          <h2 className="text-[32px] md:text-[40px] font-serif font-normal leading-tight text-white mb-4">
            Everything a coach needs
          </h2>
          <p className="text-[14px] text-[#888] font-sans max-w-[460px] leading-relaxed">
            From raw wearable data to actionable performance intelligence — all in one unified OS.
          </p>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col md:flex-row flex-wrap bg-[#080808] relative">
          {/* Row 1 */}
          <div className="w-full md:w-[40%] border-b border-[#1a1a1a] md:border-r">
            <DataFeedCard />
          </div>
          <div className="w-full md:w-[60%] border-b border-[#1a1a1a]">
            <ChatCard />
          </div>

          {/* Row 2 */}
          <div className="w-full md:w-[60%] border-b md:border-b-0 border-[#1a1a1a] md:border-r">
            <WearableHubCard />
          </div>
          <div className="w-full md:w-[40%]">
            <NeuralEngineCard />
          </div>

          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#555] pointer-events-none" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#555] pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
