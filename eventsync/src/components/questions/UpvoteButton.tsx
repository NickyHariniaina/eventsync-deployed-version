"use client"

import { useState } from "react"

type Props = {
  questionId: string
  upvotes: number
  onUpvote: (newCount: number) => void
}

export function UpvoteButton({ questionId, upvotes, onUpvote }: Props) {
  const [pending, setPending] = useState(false)

  async function handleUpvote() {
    if (pending) return
    setPending(true)
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, {
        method: "PATCH",
      })
      if (!res.ok) return
      const data = await res.json()
      onUpvote(data.upvotes)
    } catch {
      // silent fail
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={pending}
      className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:opacity-50"
    >
      <svg
        className="size-3.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
      {upvotes}
    </button>
  )
}
