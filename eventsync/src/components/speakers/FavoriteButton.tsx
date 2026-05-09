"use client"

import { useState} from "react"

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
    const [isFavorite, setIsFavorite] = useState(() => {
        if (typeof window === "undefined") return false

        const saved: string[] = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        )

        return saved.includes(sessionId)
    })

    function toggleFavorite() {
        const saved: string[] = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        )

        if (isFavorite) {
            const updated = saved.filter((id) => id !== sessionId)
            localStorage.setItem("favorites", JSON.stringify(updated))
            setIsFavorite(false)
        } else {
            saved.push(sessionId)
            localStorage.setItem("favorites", JSON.stringify(saved))
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
            {isFavorite ? "★ Favori" : "☆ Ajouter aux favoris"}
        </button>
    )
}
