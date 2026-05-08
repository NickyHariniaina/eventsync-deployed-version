import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function isSessionLive(
    startTime: Date | string,
    endTime: Date | string
): boolean {
    const now = new Date()
    return now >= new Date(startTime) && now <= new Date(endTime)
}