"use client"

import { useState } from "react"

type Props = {
  questionId: string
  upvotes: number
}

export function UpvoteButton({ questionId, upvotes: initialUpvotes }: Props) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [loading, setLoading] = useState(false)

  async function handleUpvote() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, {
        method: "PATCH",
      })
      if (!res.ok) return
      setUpvotes((prev) => prev + 1)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M7 10v12M21 10v5a2 2 0 01-2 2H9l-3-5 2-5a2 2 0 012-1h7a2 2 0 012 2z" />
      </svg>
      {upvotes}
    </button>
  )
}
