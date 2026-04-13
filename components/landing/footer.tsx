import React from "react"

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] flex justify-center text-[#555] text-xs font-mono">
      <div className="container mx-auto px-6 lg:px-12 py-10 flex items-center justify-between border-x border-[#1a1a1a]">
        <div className="flex items-center gap-3 text-white">
            <div className="w-2 h-2 bg-[#7C5CFC]" />
            <span className="font-sans font-bold tracking-[0.14em] uppercase text-[#666]">Connected Athlete</span>
        </div>
        <span>ALL RIGHTS RESERVED © 2026</span>
      </div>
    </footer>
  )
}
