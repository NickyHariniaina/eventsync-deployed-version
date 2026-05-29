import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGINS = [
  "https://eventsync-admin-ten.vercel.app",
]

export function corsHeaders(request: NextRequest): Headers {
  const headers = new Headers()
  const origin = request.headers.get("origin") || ""

  const allowed =
    origin.startsWith("http://localhost:") ||
    origin.startsWith("https://localhost:") ||
    ALLOWED_ORIGINS.includes(origin)

  if (allowed) {
    headers.set("Access-Control-Allow-Origin", origin)
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  headers.set("Access-Control-Allow-Credentials", "true")
  headers.set("Access-Control-Expose-Headers", "Content-Range")

  return headers
}

export function corsOptions(request: NextRequest) {
  return NextResponse.json(null, { headers: corsHeaders(request) })
}
