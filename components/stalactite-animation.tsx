"use client"

import { useEffect, useRef } from "react"

interface Stalactite {
  x: number
  width: number
  length: number
  opacity: number
  phase: number
  roughness: number[]
  isLarge: boolean
}

interface Drip {
  x: number
  y: number
  vy: number
  opacity: number
  r: number
}

export function StalactiteAnimation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    let W = 0
    let H = 0
    let stalactites: Stalactite[] = []
    const drips: Drip[] = []

    // Deterministic hash — stable shape regardless of paint timing
    const rng = (n: number) => ((Math.sin(n * 127.1) * 43758.5453) % 1 + 1) % 1

    const build = () => {
      stalactites = []
      let x = -30
      let idx = 0

      while (x < W + 30) {
        const nx = x / W
        const rightness = Math.max(0, (nx - 0.42) / 0.58)

        // Right side denser spacing
        const spacing = rightness > 0
          ? 7 + rng(idx * 1.1 + 0.3) * 13
          : 22 + rng(idx * 1.5 + 0.7) * 32

        x += spacing
        idx++
        if (x > W + 30) break

        const isLarge = rightness > 0.25 && rng(idx * 3.7) < 0.3

        const width = isLarge
          ? 24 + rightness * 32 + rng(idx * 2.2) * 18
          : rightness > 0
            ? 9 + rightness * 14 + rng(idx * 2.5) * 10
            : 3 + rng(idx * 2.8) * 7

        const length = isLarge
          ? H * (0.45 + rightness * 0.38 + rng(idx * 3.1) * 0.12)
          : rightness > 0
            ? H * (0.12 + rightness * 0.42 + rng(idx * 3.4) * 0.18)
            : H * (0.02 + rng(idx * 3.8) * 0.1)

        const opacity = isLarge
          ? 0.62 + rightness * 0.28
          : rightness > 0
            ? 0.3 + rightness * 0.28 + rng(idx * 5.2) * 0.1
            : 0.06 + rng(idx * 5.6) * 0.08

        // 8-segment edge roughness
        const roughness = Array.from({ length: 8 }, (_, j) =>
          (rng(idx * 7.3 + j * 11.1) - 0.5) * width * 0.24
        )

        stalactites.push({
          x: x / W,
          width,
          length,
          opacity,
          phase: rng(idx * 13.1) * Math.PI * 2,
          roughness,
          isLarge,
        })
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width || 1
      H = rect.height || 1
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const drawStalactite = (s: Stalactite, t: number) => {
      const SEGS = s.roughness.length
      const px = s.x * W
      const bw = s.width
      const breathe = 1 + Math.sin(t * 0.00022 + s.phase) * 0.006
      const len = s.length * breathe

      const rightness = Math.max(0, (s.x - 0.42) / 0.58)

      ctx.beginPath()
      ctx.moveTo(px - bw / 2, 0)

      // Right edge — tapers toward tip
      for (let i = 0; i < SEGS; i++) {
        const prog = (i + 1) / SEGS
        const taper = 1 - prog * 0.8
        const y = prog * len
        const jx = i < SEGS - 1 ? s.roughness[i] * taper : 0
        ctx.lineTo(px + (bw / 2) * taper + jx, y)
      }

      // Sharp tip
      ctx.lineTo(px, len + bw * 0.13)

      // Left edge — ascending
      for (let i = SEGS - 1; i >= 0; i--) {
        const prog = i / SEGS
        const taper = 1 - prog * 0.8
        const y = prog * len
        const jx = i > 0 ? -s.roughness[i - 1] * taper : 0
        ctx.lineTo(px - (bw / 2) * (1 - prog * 0.8) + jx, y)
      }

      ctx.closePath()

      // Stone color — dark with brand-purple tint, strongest on right
      const r1 = Math.round(38 + rightness * 32)
      const g1 = Math.round(26 + rightness * 8)
      const b1 = Math.round(62 + rightness * 68)

      const grad = ctx.createLinearGradient(0, 0, 0, len)
      grad.addColorStop(0,    `rgba(${r1 + 12}, ${g1 + 6}, ${b1 + 14}, ${s.opacity})`)
      grad.addColorStop(0.42, `rgba(${r1},      ${g1},     ${b1},      ${s.opacity * 0.88})`)
      grad.addColorStop(0.82, `rgba(${Math.round(r1 * 0.6)}, ${Math.round(g1 * 0.55)}, ${Math.round(b1 * 0.6)}, ${s.opacity * 0.55})`)
      grad.addColorStop(1,    `rgba(5, 3, 10, ${s.opacity * 0.1})`)
      ctx.fillStyle = grad
      ctx.fill()

      // Subtle rim light for the prominent right-side formations
      if (s.isLarge && rightness > 0.35) {
        ctx.strokeStyle = `rgba(124, 92, 252, ${s.opacity * 0.14})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
    }

    const spawnDrip = (s: Stalactite) => {
      const rightness = Math.max(0, (s.x - 0.42) / 0.58)
      if (rightness < 0.2 || Math.random() > 0.00018) return
      drips.push({
        x: s.x * W + (Math.random() - 0.5) * 2.5,
        y: s.length + s.width * 0.13,
        vy: 0.35 + Math.random() * 0.65,
        opacity: 0.38 + Math.random() * 0.32,
        r: 1.2 + Math.random() * 1.8,
      })
    }

    const animate = (t: number) => {
      ctx.clearRect(0, 0, W, H)

      // Paint shorter (background) stalactites first
      const sorted = stalactites.slice().sort((a, b) => a.length - b.length)
      for (const s of sorted) {
        drawStalactite(s, t)
        spawnDrip(s)
      }

      // Water drips falling from tips
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i]
        d.y += d.vy
        d.vy += 0.028
        d.opacity -= 0.005
        if (d.y > H || d.opacity <= 0) {
          drips.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.r * 0.52, d.r, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 75, 200, ${d.opacity})`
        ctx.fill()
      }

      raf = requestAnimationFrame(animate)
    }

    resize()

    const ro = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect()
      if (Math.abs(rect.width - W) > 1 || Math.abs(rect.height - H) > 1) resize()
    })
    ro.observe(canvas)
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className ?? ""}`}
      aria-hidden
    />
  )
}
