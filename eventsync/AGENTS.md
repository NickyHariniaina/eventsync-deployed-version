<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm test             # Run all Vitest tests (unit + integration)
pnpm test -t "name"   # Run tests matching pattern
pnpm lint             # ESLint
pnpm seed             # Seed database with prisma/seed.ts
```

**Test projects:** `vitest.config.ts` defines two projects — `unit` and `integration`.

## Critical Architecture Notes

**Prisma model naming conflict:**
- `TalkSession` in schema = event sessions
- `Session` in schema = Better Auth auth sessions (not event sessions)
- Fixtures use `mockSession()` which maps to `TalkSession`

**Auth guard:**
- `src/proxy.ts` protects `/admin/*` routes (Next.js 16 convention — NOT `middleware.ts`)
- API routes use `auth.api.getSession({ headers: request.headers })`
- Return `{ error: "Non autorisé" }` with status 401 on failure

**Dynamic route params inconsistency across team:**
- Person A's event routes: `{ params }: { params: { id: string } }` (sync)
- Person D's question routes: `{ params }: { params: Promise<{ id: string }> }` (async, Next.js 16 standard)
- Align new code with the Promise pattern

**Frontend pages use mock data:**
- `/(public)/events/page.tsx` and `/(public)/events/[id]/page.tsx` have hardcoded mock data
- API routes exist at `/api/events` and `/api/events/[id]` but pages don't call them

**UI library:** shadcn backed by `@base-ui/react` (not Radix UI)

**Zod v4:** API differs from v3 — check docs before using

## Testing Conventions

Integration tests in `test/integration/`:

```ts
vi.mock("@/lib/prisma", () => ({
  prisma: { model: { method: vi.fn() } },
}))

const { GET } = await import("@/app/api/.../route")
const { prisma } = await import("@/lib/prisma")

describe("...", () => {
  beforeEach(() => vi.resetAllMocks())
  // vi.mocked(prisma.model.method).mockResolvedValue(...)
})
```

- Mock `@/lib/prisma` BEFORE importing route handlers
- Use `vi.mocked()` for TS type narrowing
- Fixtures: `mockEvent()`, `mockSession()`, `mockQuestion()` in `test/fixtures/index.ts`

## Task Ownership

| Person | Scope |
|--------|-------|
| A | Auth, Events CRUD, Admin dashboard, Multi-track planning |
| B | Sessions CRUD, Session detail, Live detection, Room views |
| C | Speakers CRUD, Speaker pages, Favorites (localStorage) |
| D | Q&A system, Event public pages (list + detail) |

Do not modify another person's routes/pages without coordination. See `docs/generated_structure.md` for full breakdown.

## Library Docs

Use the `find-docs` skill for any library, framework, or API questions — including well-known ones like Next.js, Prisma, Zod, React, etc. APIs change frequently; always verify against current docs.
