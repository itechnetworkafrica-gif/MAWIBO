# MAWIBO — AI-Powered Healthcare Super App

Africa's most advanced AI-powered health platform for Liberia and West Africa.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from $PORT)
- `pnpm --filter @workspace/mawibo run dev` — run the frontend (port from $PORT, base from $BASE_PATH)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for AI features |
| `SESSION_SECRET` | ✅ | Random 32+ char secret |
| `PORT` | Dev | Port for the server (set by Replit) |
| `BASE_PATH` | Dev | Base URL path (set by Replit) |
| `CORS_ORIGIN` | Prod | Comma-separated allowed origins |
| `VITE_API_URL` | Prod | API URL when frontend/API on different domains |

See `.env.example` for a complete reference.

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind CSS v4, Framer Motion, Recharts
- API: Express 5, Pino logger
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI GPT-4o-mini (streaming SSE)
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (API bundle), Vite (frontend)

## Where Things Live

```
artifacts/
  mawibo/          # React 19 + Vite frontend — 30+ pages
  api-server/      # Express 5 API — 21 route modules
lib/
  db/              # PostgreSQL schema (Drizzle ORM) — source of truth for DB
  api-spec/        # openapi.yaml — source of truth for API contracts
  api-zod/         # Generated Zod schemas (do not edit manually)
  api-client-react/# Generated React Query hooks (do not edit manually)
```

## Architecture Decisions

- **API codegen**: OpenAPI spec → Orval → TypeScript types + React Query hooks + Zod validators. Edit only `lib/api-spec/src/openapi.yaml`, then run codegen.
- **Auth**: Token-based (localStorage). Token = `mawibo-<userId>`. Passwords hashed with `scrypt` + salt. JWT migration is a planned improvement.
- **AI Chat**: Server-Sent Events (SSE) streaming from Express → OpenAI → client.
- **DEFAULT_USER_ID**: Routes currently use a hardcoded `DEFAULT_USER_ID = 1` placeholder. Proper per-request auth middleware is a planned improvement.
- **Chunk splitting**: Vite build splits: react-vendor, query, motion, charts, radix, icons for optimal caching.

## Deployment

- **Frontend** → Vercel: root `vercel.json` configured. One-click deploy.
- **API** → Railway / Render / any Node host: `artifacts/api-server/vercel.json` for Vercel API deployment.
- See `DEPLOYMENT.md` for step-by-step instructions.

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `pnpm-workspace.yaml` excludes non-Linux platform binaries for Replit compatibility. Building locally on macOS requires removing those overrides.
- The `vite.config.ts` requires `PORT` and `BASE_PATH` env vars for the **dev server** only — the production build works without them.
- `@assets` alias resolves to `../../attached_assets` (root `attached_assets/` dir). Keep that directory committed.
- AI tools (`/api/ai-tools/*`) require `OPENAI_API_KEY` to be set on the API server.
