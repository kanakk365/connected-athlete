"use client"

import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

const PixelPillars = dynamic(() => import("../pixel-pillars"), { ssr: false })

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-[#1a1a1a] overflow-hidden pt-20">
      <div className="container relative mx-auto px-6 lg:px-12 flex flex-col border-x border-[#1a1a1a] h-full flex-1 justify-center py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PixelPillars
            pixelSize={4}
            color="#7C5CFC"
            gap={1}
            className="opacity-100"
          />
        </div>
        {/* Left-side mask so heading and buttons stay legible */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{background: "linear-gradient(to right, #080808 30%, #080808cc 55%, transparent 75%)"}} />
        <div className="relative z-[2] max-w-[700px] lg:ml-20">
          <h1 className="text-[56px] md:text-[88px] font-serif font-normal leading-[1.05] tracking-tight text-white mb-8">
            The Athlete<br />Data OS
          </h1>

          <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#888] font-mono mb-12">
            One unified platform aggregating biometric data<br/>
            from <span className="text-white">every wearable</span>. Built for performance coaches<br/>who demand <span className="text-white">precision, not approximation.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold text-[13px] tracking-[0.1em] hover:bg-[#e0e0e0] transition-colors uppercase cursor-pointer"
            >
              Get Started
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className="w-full sm:w-auto border border-[#333] text-white px-8 py-4 font-bold text-[13px] tracking-[0.1em] hover:border-[#666] hover:bg-[#111] transition-all relative uppercase">
              Learn More
              {/* corner accents */}
              <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/30" />
              <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/30" />
              <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/30" />
              <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/30" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
