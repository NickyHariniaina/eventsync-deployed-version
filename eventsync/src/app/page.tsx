import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroText } from "@/components/hero-text"

export default function Home() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-4"
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
        <div className="flex flex-col items-center gap-6 text-center max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            EventSync
          </h1>
          <div className="text-lg text-foreground max-w-lg h-14 sm:h-10">
            <HeroText />
          </div>
          <Link
            href="/events"
            className="sunset-btn inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium text-white transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-[#a33b20]/30"
          >
            Explorer les événements
          </Link>
        </div>
      </div>
    </>
  )
}
