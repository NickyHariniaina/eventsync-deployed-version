export type Question = {
  id: string
  content: string
  author: string | null
  upvotes: number
  sessionId: string
  createdAt: Date
}