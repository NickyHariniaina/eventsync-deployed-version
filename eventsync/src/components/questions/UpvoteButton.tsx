"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "evsync_upvotes"

function getUpvotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

function saveUpvotedId(id: string) {
  try {
    const ids = getUpvotedIds()
    ids.add(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // storage full or blocked
  }
}

type Props = {
  questionId: string
  upvotes: number
}

export function UpvoteButton({ questionId, upvotes: initialUpvotes }: Props) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  useEffect(() => {
    setUpvoted(getUpvotedIds().has(questionId))
  }, [questionId])

  async function handleUpvote() {
    if (loading || upvoted) return
    setLoading(true)
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, {
        method: "PATCH",
      })
      if (!res.ok) return
      setUpvotes((prev) => prev + 1)
      setUpvoted(true)
      saveUpvotedId(questionId)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={loading || upvoted}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        upvoted
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={upvoted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M7 10v12M21 10v5a2 2 0 01-2 2H9l-3-5 2-5a2 2 0 012-1h7a2 2 0 012 2z" />
      </svg>
      {upvotes}
    </button>
  )
}
