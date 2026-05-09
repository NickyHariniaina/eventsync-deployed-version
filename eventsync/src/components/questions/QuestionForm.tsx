"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import type { Question } from "@/types"

type Props = {
  sessionId: string
  onQuestionCreated: (question: Question) => void
}

export function QuestionForm({ sessionId, onQuestionCreated }: Props) {
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
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
        const body = await res.json()
        setError(body.error ?? "Une erreur est survenue")
        return
      }

      const question: Question = await res.json()
      onQuestionCreated(question)
      setContent("")
      setAuthor("")
    } catch {
      setError("Impossible de soumettre la question")
    } finally {
      setSubmitting(false)
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
        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div className="flex items-start gap-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? "Envoi..." : "Envoyer"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="text-sm">
          {error}
        </Alert>
      )}
    </form>
  )
}
