"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  sessionId: string
  onQuestionAdded: () => void
}

export function QuestionForm({ sessionId, onQuestionAdded }: Props) {
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          author: author.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Une erreur est survenue")
        return
      }

      setContent("")
      setAuthor("")
      onQuestionAdded()
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Posez votre question..."
        rows={3}
        required
        className={cn(
          "w-full rounded-xl border-2 border-border bg-background p-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-all duration-200",
          "focus:border-primary focus:ring-2 focus:ring-primary/20"
        )}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className={cn(
            "flex-1 rounded-xl border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-all duration-200",
            "focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="sunset-btn inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-white transition-all disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </form>
  )
}
