import { NextResponse } from "next/server"
import { upvoteQuestion } from "@/lib/questions"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const question = await upvoteQuestion(id)
    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Question not found") {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
