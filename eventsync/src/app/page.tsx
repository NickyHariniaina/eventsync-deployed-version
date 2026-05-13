import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { FeatureEvents } from "@/components/sections/feature-events"
import { FeatureSessions } from "@/components/sections/feature-sessions"
import { FeatureSpeakers } from "@/components/sections/feature-speakers"
import { FeatureRooms } from "@/components/sections/feature-rooms"
import { FeatureSchedule } from "@/components/sections/feature-schedule"
import { FeatureFavorites } from "@/components/sections/feature-favorites"
import { CtaSection } from "@/components/sections/cta-section"

export default function Home() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center px-4"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, color-mix(in srgb, #a33b20 12%, transparent) 0%, transparent 70%),
            radial-gradient(ellipse at 30% 20%, color-mix(in srgb, #a47963 10%, transparent) 0%, transparent 50%),
            linear-gradient(to right, var(--home-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--home-grid) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
          backgroundColor: "var(--home-bg)",
        }}
      >
        <HeroSection />
        <div className="w-full max-w-6xl pb-24 space-y-28">
          <StatsSection />
          <FeatureEvents />
          <FeatureSessions />
          <FeatureSpeakers />
          <FeatureRooms />
          <FeatureSchedule />
          <FeatureFavorites />
          <CtaSection />
        </div>
      </div>
    </>
  )
}
