"use client"

import React from "react"
import { NavBar } from "../components/landing/nav-bar"
import { HeroSection } from "../components/landing/hero-section"
import { FAQSection } from "../components/landing/faq-section"
import { CtaOrbitSection } from "../components/landing/cta-orbit-section"
import { Footer } from "../components/landing/footer"
import { BentoSection } from "../components/landing/bento-section"
import { PlatformCapabilities } from "../components/landing/platform-capabilities"
import { LegacyOrbitSection } from "@/components/landing/legacy-orbit-section"

export default function LandingPage() {
  return (
    <main className="bg-[#080808] text-[#e8e8e8] min-h-screen font-sans selection:bg-[#7C5CFC] selection:text-[#fff]">
      <NavBar />
      <HeroSection />
      <LegacyOrbitSection/>
      <CtaOrbitSection />
      <PlatformCapabilities />

      <BentoSection />
      <FAQSection />

      <Footer />
    </main>
  )
}
