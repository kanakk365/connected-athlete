"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        scrolled ? "bg-[#080808]/95 border-[#1a1a1a] backdrop-blur" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between border-x border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#7C5CFC] shrink-0" />
          <span className="text-[13px] font-extrabold tracking-[0.18em] text-white uppercase">
            Connected Athlete
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Integrations", "Developers", "Pricing"].map((item, idx) => (
            <div key={item} className="flex items-center gap-8">
              {idx > 0 && <span className="text-[#333]">/</span>}
              <span className="text-[12px] font-medium tracking-[0.12em] text-[#8a8a8a] hover:text-white transition-colors cursor-pointer uppercase">
                {item}
              </span>
            </div>
          ))}
        </div>

        <Link 
          href="/dashboard"
          className="text-[11px] font-bold tracking-[0.14em] border border-[#333] text-white px-5 py-2 hover:bg-[#7C5CFC] hover:border-[#7C5CFC] transition-all uppercase cursor-pointer"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  )
}
