import { NextResponse } from "next/server"
import { createQuestion, getQuestions } from "@/lib/questions"
import { createQuestionSchema } from "@/lib/validators"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const questions = await getQuestions(id)
    return NextResponse.json(questions)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const body = await request.json()
  const parsed = createQuestionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    )
  }

  try {
    const question = await createQuestion(id, parsed.data)
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Session not found") {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message === "Session is not live") {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
