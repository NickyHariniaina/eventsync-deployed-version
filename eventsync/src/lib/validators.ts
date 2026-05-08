import { z } from "zod"

export const createQuestionSchema = z.object({
  content: z.string().min(1, "Question cannot be empty"),
  author: z.string().optional(),
})

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>

const nonEmpty = z.string().trim().min(1, "Required")

// ── Events ──
export const createEventSchema = z.object({
  title: nonEmpty,
  description: z.string().trim().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().trim().optional(),
})

export const updateEventSchema = createEventSchema

export type CreateEventDto = z.infer<typeof createEventSchema>
export type UpdateEventDto = z.infer<typeof updateEventSchema>

// ── Sessions ──
export const createSessionSchema = z.object({
  title: nonEmpty,
  description: z.string().trim().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  capacity: z.number().int().positive().optional(),
  eventId: nonEmpty,
  roomId: nonEmpty,
  speakerIds: z.array(z.string().min(1)).optional(),
})

export const updateSessionSchema = createSessionSchema.partial()

export type CreateSessionDto = z.infer<typeof createSessionSchema>
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>

// ── Speakers ──
export const createSpeakerSchema = z.object({
  name: nonEmpty,
  photo: z.string().optional(),
  bio: z.string().trim().optional(),
  links: z.array(z.object({
    label: nonEmpty,
    url: z.string().min(1, "Link URL is required"),
  })).optional(),
})

export const updateSpeakerSchema = createSpeakerSchema.partial()

export type CreateSpeakerDto = z.infer<typeof createSpeakerSchema>
export type UpdateSpeakerDto = z.infer<typeof updateSpeakerSchema>
