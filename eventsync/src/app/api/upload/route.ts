import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { corsHeaders, corsOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return corsOptions(request)
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders(request)
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400, headers },
    )
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400, headers },
    )
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400, headers },
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "speakers", transformation: { width: 400, crop: "fill" } },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!)
      },
    )
    uploadStream.end(buffer)
  })

  return NextResponse.json(
    { url: result.secure_url },
    { headers },
  )
}
