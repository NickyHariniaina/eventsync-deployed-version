import { z } from "zod"

export const createQuestionSchema = z.object({
  content: z.string().min(1, "Question cannot be empty"),
  author: z.string().optional(),
})

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>
