"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          EventSync
        </Link>
        <nav className="hidden md:flex items-center gap-6">
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
            href="/favorites"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Favoris
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1.5 rounded-md text-foreground/60 hover:text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border px-4 py-3 space-y-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>
          <Link
            href="/favorites"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Favoris
          </Link>
        </nav>
      )}
    </header>
  )
}
