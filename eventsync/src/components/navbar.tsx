import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-3">
        <div className="absolute left-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            EventSync
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
        </nav>
        <div className="absolute right-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
