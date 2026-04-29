import { defineConfig } from "vitest/config"
import path from "path"

const alias = {
  "@": path.resolve(__dirname, "src"),
}

export default defineConfig({
  resolve: { alias },
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: "unit",
          include: ["./test/unit/**/*.test.ts"],
          alias,
        },
      },
      {
        test: {
          name: "integration",
          include: ["./test/integration/**/*.test.ts"],
          alias,
        },
      },
    ],
  },
})
