import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGINS = [
  "https://eventsync-admin-ten.vercel.app",
]

export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin") || ""

  const allowed =
    origin.startsWith("http://localhost:") ||
    origin.startsWith("https://localhost:") ||
    ALLOWED_ORIGINS.includes(origin)

  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "Content-Range",
  }
}

export function corsOptions(request: NextRequest) {
  return NextResponse.json(null, {
    headers: new Headers(corsHeaders(request)),
  })
}
