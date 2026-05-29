"use client"

import { useState } from "react"

const FAVORITES_KEY = "favorites"

function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
}

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
  const [isFavorite, setIsFavorite] = useState(() => {
    return getFavorites().includes(sessionId)
  })

  function toggleFavorite() {
    const saved = getFavorites()

    if (isFavorite) {
      const updated = saved.filter((id) => id !== sessionId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      setIsFavorite(false)
    } else {
      saved.push(sessionId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(saved))
      setIsFavorite(true)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`border rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        isFavorite
          ? "bg-yellow-100 border-yellow-400 text-yellow-700"
          : "border-gray-300 text-gray-400 hover:border-yellow-400 hover:text-yellow-600"
      }`}
    >
      {isFavorite ? "\u2605 Favori" : "\u2606 Ajouter aux favoris"}
    </button>
  )
}
