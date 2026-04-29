import { prisma } from "@/lib/prisma"
import { CreateQuestionDto } from "@/lib/validators"

export async function getQuestions(sessionId: string) {
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { upvotes: "desc" },
  })

  return questions
}

export async function upvoteQuestion(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  })

  if (!question) {
    throw new Error("Question not found")
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { upvotes: question.upvotes + 1 },
  })

  return updated
}

export async function createQuestion(
  sessionId: string,
  input: CreateQuestionDto,
) {
  const session = await prisma.talkSession.findUnique({
    where: { id: sessionId },
  })

  if (!session) {
    throw new Error("Session not found")
  }

  const now = new Date()
  if (now < session.startTime || now > session.endTime) {
    throw new Error("Session is not live")
  }

  const question = await prisma.question.create({
    data: {
      content: input.content,
      author: input.author,
      sessionId,
    },
  })

  return question
}
