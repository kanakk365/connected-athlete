"use client"

import React from "react"

export function PlatformCapabilities() {
  return (
    <section className="bg-[#080808] flex justify-center w-full">
      <div className="container mx-auto border-x border-b border-[#1a1a1a] flex flex-col relative bg-[#0a0a0a]">
        
        {/* Top container brackets */}
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#444] pointer-events-none" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#444] pointer-events-none" />

        {/* 1) Header Row */}
        <div className="border-b border-[#1a1a1a] py-8 flex justify-center items-center">
           <span className="text-[12px] font-bold tracking-[0.2em] text-[#666] uppercase">
             SUPPORTED <span className="text-[#444]">INTEGRATIONS</span>
           </span>
        </div>

        {/* 2) Marquee Row */}
        <div className="overflow-hidden flex flex-1 relative border-b border-[#1a1a1a]">
          <div className="flex animate-marquee whitespace-nowrap w-max items-stretch h-[100px]">
            {[
              "Garmin", "Whoop", "Apple Watch", "Oura", "Polar", "Fitbit", 
              "Suunto", "Coros", "Withings", "Wahoo", "Samsung Health", 
              "Google Fit", "Eight Sleep", "Biostrap", "Peloton", "Zwift", "Concept2"
            ].map((brand, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center justify-center gap-3 w-[240px] shrink-0 border-r border-[#1a1a1a] h-full">
                  <div className="w-5 h-5 bg-[#111] border border-[#222] rounded flex items-center justify-center">
                    <span className="w-2 h-2 bg-[#7C5CFC]" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#888] tracking-tight">{brand}</span>
                </div>
              </React.Fragment>
            ))}
            {/* Duplicated list */}
            {[
              "Garmin", "Whoop", "Apple Watch", "Oura", "Polar", "Fitbit", 
              "Suunto", "Coros", "Withings", "Wahoo", "Samsung Health", 
              "Google Fit", "Eight Sleep", "Biostrap", "Peloton", "Zwift", "Concept2"
            ].map((brand, i) => (
              <React.Fragment key={`dup-${i}`}>
                <div className="flex items-center justify-center gap-3 w-[240px] shrink-0 border-r border-[#1a1a1a] h-full">
                  <div className="w-5 h-5 bg-[#111] border border-[#222] rounded flex items-center justify-center">
                    <span className="w-2 h-2 bg-[#7C5CFC]" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#888] tracking-tight">{brand}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3) "What We Build" Box */}
        <div className="flex flex-col items-center justify-center text-center py-20 relative border-b border-[#1a1a1a] bg-[#080808]">
          {/* Box-specific Accents bridging from marquee to features */}
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#555] pointer-events-none z-10" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#555] pointer-events-none z-10" />
          
          <h2 className="text-[28px] md:text-[32px] font-sans font-normal leading-tight text-white mb-6">
            Platform Capabilities
          </h2>
          <p className="text-[13px] text-[#777] font-mono max-w-2xl px-6">
            Core capabilities for automating data extraction, wearable sync pipelines, and custom performance infrastructure.
          </p>
        </div>

        {/* 4) Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 relative bg-[#080808]">
          {/* Center Grid Splitter */}
          <div className="hidden md:block absolute top-[50%] left-0 right-0 h-px bg-[#1a1a1a] z-0" />
          <div className="hidden md:block absolute top-0 bottom-0 left-[50%] w-px bg-[#1a1a1a] z-0" />

          {/* Card 1 */}
          <div className="p-12 relative flex flex-col md:border-b-0 border-b border-[#1a1a1a] z-10">
            <div className="w-16 h-16 mb-10 flex items-center justify-center relative bg-transparent">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#555]" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#555]" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#555]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#555]" />
              
              <div className="relative flex items-center justify-center gap-1">
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono mr-1">
                  <span>101</span>
                  <span>010</span>
                  <span>110</span>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#888]">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 12C8 16.4183 9.79086 20 12 20C14.2091 20 16 16.4183 16 12C16 7.58172 14.2091 4 12 4C9.79086 4 8 7.58172 8 12Z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono ml-1">
                  <span>011</span>
                  <span>100</span>
                  <span>001</span>
                </div>
              </div>
            </div>
            <h3 className="text-[15px] font-sans font-medium text-white mb-4">
              Automated Data Extraction
            </h3>
            <p className="text-[13px] text-[#777] font-mono leading-[1.8] max-w-[360px]">
              Connect Garmin, Whoop, Apple Watch, Oura Ring and 50+ devices into one real-time stream. Zero fragmentation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-12 relative flex flex-col md:border-b-0 border-b border-[#1a1a1a] z-10">
            <div className="w-16 h-16 mb-10 flex items-center justify-center relative bg-transparent">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#555]" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#555]" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#555]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#555]" />
              
              <div className="relative flex items-center justify-center gap-1">
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono mr-1">
                  <span>010</span>
                  <span>101</span>
                  <span>011</span>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#888]">
                  <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M12 4L12 20" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono ml-1">
                  <span>101</span>
                  <span>010</span>
                  <span>110</span>
                </div>
              </div>
            </div>
            <h3 className="text-[15px] font-sans font-medium text-white mb-4">
              Identity & Readiness Pipelines
            </h3>
            <p className="text-[13px] text-[#777] font-mono leading-[1.8] max-w-[360px]">
              Deep HRV analysis, sleep stages, training load, and recovery scores synthesised into actionable daily readiness outputs.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="p-12 relative flex flex-col md:border-b-0 border-b border-[#1a1a1a] z-10">
            <div className="w-16 h-16 mb-10 flex items-center justify-center relative bg-transparent">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#555]" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#555]" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#555]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#555]" />
              
              <div className="relative flex items-center justify-center gap-1">
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono mr-1">
                  <span>110</span>
                  <span>011</span>
                  <span>101</span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#888]">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 22.0001L10 11.0001L2 8.00012L22 2.00012L13 22.0001Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono ml-1">
                  <span>001</span>
                  <span>110</span>
                  <span>010</span>
                </div>
              </div>
            </div>
            <h3 className="text-[15px] font-sans font-medium text-white mb-4">
              Live Performance Streams
            </h3>
            <p className="text-[13px] text-[#777] font-mono leading-[1.8] max-w-[360px]">
              Coach and athlete share the same live dashboard during sessions, featuring real-time biometric overlays direct to video.
            </p>
          </div>
          
          {/* Card 4 */}
          <div className="p-12 relative flex flex-col z-10">
            <div className="w-16 h-16 mb-10 flex items-center justify-center relative bg-transparent">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#555]" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#555]" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#555]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#555]" />
              
              <div className="relative flex items-center justify-center gap-1">
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono mr-1">
                  <span>100</span>
                  <span>111</span>
                  <span>010</span>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#888]">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M8 6V18M16 6V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <div className="flex flex-col text-[5px] leading-[6px] tracking-[0.2em] text-[#444] font-mono ml-1">
                  <span>010</span>
                  <span>001</span>
                  <span>101</span>
                </div>
              </div>
            </div>
            <h3 className="text-[15px] font-sans font-medium text-white mb-4">
              Nutrition & Body Metrics
            </h3>
            <p className="text-[13px] text-[#777] font-mono leading-[1.8] max-w-[360px]">
              Track macros, hydration levels, and body composition trends correlated directly against performance output data.
            </p>
          </div>
          {/* Bottom global frame brackets */}
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#555] pointer-events-none" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#555] pointer-events-none" />
        </div>
        
      </div>
    </section>
  )
}
