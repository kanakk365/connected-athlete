"use client"

import React from "react"
import { NavBar } from "../components/landing/nav-bar"
import { HeroSection } from "../components/landing/hero-section"

export default function LandingPage() {
  return (
    <main className="bg-[#080808] text-[#e8e8e8] min-h-screen font-sans selection:bg-[#7C5CFC] selection:text-[#fff]">
      <NavBar />
      <HeroSection />
      {/* <PlatformCapabilities />
       */}
      {/* <BentoSection /> */}
      {/* <FAQSection />

      <CtaOrbitSection />

      <Footer /> */}
    </main>
  )
}
