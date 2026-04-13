"use client"

import React, { useEffect, useRef } from "react"

export default function PixelPillars({
  color = "#ffffff",
  pixelSize = 3,
  gap = 1,
  className = "",
}: {
  color?: string
  pixelSize?: number
  gap?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame: number
    let w = 0
    let h = 0

    const colWidth = pixelSize + gap

    // Stable hash function
    const hash = (x: number, y: number) => {
      const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return h - Math.floor(h)
    }

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      
      const cols = Math.ceil(w / colWidth)
      const rows = Math.ceil(h / colWidth)
      
      for (let x = 0; x < cols; x++) {
        const rightBias = x / cols // 0 on left, 1 on right
        
        // Animated multi-frequency noise to make sections appear and disappear
        // Faster animation: increased t multipliers
        const noise =
          Math.sin(x * 0.05 + t * 0.0003) * 0.5 +
          Math.sin(x * 0.1 + t * 0.00045) * 0.25 +
          Math.sin(x * 0.2 + t * 0.00015) * 0.125
        const normalizedNoise = (noise + 0.875) / 1.75 // strictly 0 to 1

        // Base column length: very short on left, longer on right, animated by noise
        let colLenRows = (0.02 + rightBias * 0.15 + (normalizedNoise * 0.15 * (0.3 + rightBias))) * rows
        let bottomColLenRows = (0.02 + rightBias * 0.15 + (normalizedNoise * 0.15 * (0.3 + rightBias))) * rows
        
        // Randomly inject hanging lines from TOP
        if (hash(x, 0) > 0.8) {
          const timeOffset = hash(x, 6) * Math.PI * 2
          const animatedLength = (Math.sin(t * 0.0009 + timeOffset) + 1) / 2
          colLenRows += hash(x, 1) * animatedLength * (0.2 + rightBias * 0.6) * rows
        } else if (hash(x, 2) > 0.6) {
          const timeOffset = hash(x, 7) * Math.PI * 2
          const animatedLength = (Math.sin(t * 0.0012 + timeOffset) + 1) / 2
          colLenRows += hash(x, 3) * animatedLength * (0.1 + rightBias * 0.4) * rows
        }

        // Randomly inject growing lines from BOTTOM (using different hash seeds so it doesn't just mirror vertically identically)
        if (hash(x, 10) > 0.8) {
          const timeOffset = hash(x, 16) * Math.PI * 2
          const animatedLength = (Math.sin(t * 0.0009 + timeOffset) + 1) / 2
          bottomColLenRows += hash(x, 11) * animatedLength * (0.2 + rightBias * 0.6) * rows
        } else if (hash(x, 12) > 0.6) {
          const timeOffset = hash(x, 17) * Math.PI * 2
          const animatedLength = (Math.sin(t * 0.0012 + timeOffset) + 1) / 2
          bottomColLenRows += hash(x, 13) * animatedLength * (0.1 + rightBias * 0.4) * rows
        }
        
        colLenRows = Math.floor(colLenRows)
        bottomColLenRows = Math.floor(bottomColLenRows)

        for (let y = 0; y < rows; y++) {
          const isTopSection = y <= colLenRows
          const isBottomSection = y >= (rows - bottomColLenRows)
          
          let probability = 1.0
          let isStray = false
          let isBottomArea = false

          if (isTopSection) {
            // Main top pillar body: start breaking apart near the tip
            const distToTip = colLenRows - y
            if (distToTip < 15) probability = distToTip / 15.0
          } else if (isBottomSection) {
            // Main bottom pillar body: start breaking apart near the tip (points up)
            const distToTip = y - (rows - bottomColLenRows)
            if (distToTip < 15) probability = distToTip / 15.0
            isBottomArea = true
          } else {
            // In the empty middle, evaluate strays
            const distToTopTip = y - colLenRows
            const distToBottomTip = (rows - bottomColLenRows) - y
            
            if (distToTopTip < 20 && hash(x, y) > 0.985) {
              probability = 1.0
              isStray = true
            } else if (distToBottomTip < 20 && hash(x, y + 50) > 0.985) {
              probability = 1.0
              isStray = true
              isBottomArea = true
            } else {
              continue
            }
          }
          
          if (hash(x, y + 100) > probability) continue // Missing pixel
          
          // Calculate brightness
          let brightness = 0.3 + hash(x, y + 200) * 0.7
          
          // Fade out towards the tips
          if (!isStray) {
            if (isTopSection) {
              const distToTip = colLenRows - y
              if (distToTip < 10) brightness *= (distToTip / 10.0 + 0.1)
            } else if (isBottomSection) {
              const distToTip = y - (rows - bottomColLenRows)
              if (distToTip < 10) brightness *= (distToTip / 10.0 + 0.1)
            }
          } else {
            brightness *= 0.3
          }
          
          // User requested bottom elements to be "very dim and dull"
          if (isBottomArea) {
            brightness *= 0.25 
          }
          
          // Mask effect: softer fade, allowing more animation to be visible towards the middle
          const smoothMask = Math.pow(rightBias, 1.2) // increased visibility across the screen
          
          // Shimmer and dynamic diagonal shine effect
          const shimmer = Math.sin(t * 0.003 + x * 0.1 + y * 0.1) * 0.2 + 1.2 
          // Softer, wider, and slower diagonal wave
          const diagonalWave = Math.sin(x * 0.03 - y * 0.03 + t * 0.002)
          const shine = Math.pow(Math.max(0, diagonalWave), 4) * 2.0 
          
          const alpha = brightness * (shimmer + shine) * smoothMask
          
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
          ctx.fillStyle = color
          ctx.fillRect(x * colWidth, y * colWidth, pixelSize, pixelSize)
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }

    init()
    animationFrame = requestAnimationFrame(draw)

    const handleResize = () => {
      init()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [color, pixelSize, gap])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
