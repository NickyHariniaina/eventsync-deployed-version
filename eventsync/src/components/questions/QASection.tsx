"use client"

import { useState } from "react"
import { isSessionLive } from "@/lib/utils"
import { QuestionForm } from "@/components/questions/QuestionForm"
import { QuestionList } from "@/components/questions/QuestionList"

type Props = {
  sessionId: string
  startTime: string
  endTime: string
  initialQuestions: any[]
}

export function QASection({ sessionId, startTime, endTime, initialQuestions }: Props) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const live = isSessionLive(startTime, endTime)

  if (!live) {
    const notStarted = new Date() < new Date(startTime)
    return (
      <div className="mt-8 rounded-xl border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        {notStarted
          ? "Les questions seront disponibles quand la session commence."
          : "Cette session est terminée."}
      </div>
    )
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Questions & Réponses</h2>
      <div className="space-y-6">
        <QuestionForm
          sessionId={sessionId}
          onQuestionAdded={() => setRefreshTrigger((prev) => prev + 1)}
        />
        <QuestionList
          sessionId={sessionId}
          initialQuestions={initialQuestions}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </section>
  )
}
