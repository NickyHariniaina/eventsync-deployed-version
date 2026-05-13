import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:5173" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,PATCH,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Range" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Expose-Headers", value: "Content-Range, Content-Length" },
        ],
      },
    ]
  },
}

export default nextConfig