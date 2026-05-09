"use client"

import { useCallback, useState } from "react"
import { QuestionForm } from "./QuestionForm"
import { UpvoteButton } from "./UpvoteButton"
import type { Question } from "@/types"

type Props = {
  initialQuestions: Question[]
  sessionId: string
}

export function QuestionList({ initialQuestions, sessionId }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  const handleQuestionCreated = useCallback((question: Question) => {
    setQuestions((prev) => [question, ...prev])
  }, [])

  const handleUpvote = useCallback((questionId: string, newCount: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: newCount } : q))
    )
  }, [])

  return (
    <div className="space-y-6">
      <QuestionForm
        sessionId={sessionId}
        onQuestionCreated={handleQuestionCreated}
      />

      {questions.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          Aucune question pour le moment. Soyez le premier à poser une question
          !
        </p>
      ) : (
        <ul className="space-y-3">
          {questions.map((question) => (
            <li
              key={question.id}
              className="flex items-start justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">{question.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {question.author ?? "Anonyme"}
                </p>
              </div>
              <UpvoteButton
                questionId={question.id}
                upvotes={question.upvotes}
                onUpvote={(n) => handleUpvote(question.id, n)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
