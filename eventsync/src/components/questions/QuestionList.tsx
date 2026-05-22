"use client"

import { useState, useEffect } from "react"
import { UpvoteButton } from "./UpvoteButton"

type Question = {
  id: string
  content: string
  author: string | null
  upvotes: number
  createdAt: string
}

type Props = {
  sessionId: string
  initialQuestions: Question[]
  refreshTrigger: number
}

export function QuestionList({ sessionId, initialQuestions, refreshTrigger }: Props) {
  const [questions, setQuestions] = useState(initialQuestions)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/questions`)
        if (res.ok) {
          setQuestions(await res.json())
        }
      } catch {
        // silently fail
      }
    }

    fetchQuestions()
  }, [sessionId, refreshTrigger])

  if (questions.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground/60 py-8">
        Aucune question pour le moment. Soyez le premier à poser une question !
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <div key={q.id} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-card-foreground">{q.content}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {q.author && (
                <span className="text-xs font-medium text-muted-foreground">{q.author}</span>
              )}
              <span className="text-xs text-muted-foreground/60">
                {new Date(q.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <UpvoteButton questionId={q.id} upvotes={q.upvotes} />
          </div>
        </div>
      ))}
    </div>
  )
}
