---
name: MAWIBO production setup
description: Deployment decisions, env vars, build quirks and architecture notes for the MAWIBO healthcare app
---

## Required env vars
- `DATABASE_URL` — PostgreSQL connection string (api-server + db lib)
- `OPENAI_API_KEY` — OpenAI key (ai-chat.ts, ai-tools routes)
- `SESSION_SECRET` — set but not currently used by session middleware (localStorage-based auth)
- `PORT` / `BASE_PATH` — set by Replit for dev; optional for prod build (defaults: 3000, "/")
- `CORS_ORIGIN` — comma-separated allowed origins in production
- `VITE_API_URL` — set on Vercel frontend when API is on a different domain

## Build quirks
- `vite.config.ts` previously threw hard errors for missing PORT/BASE_PATH — now gracefully defaults. Do not reintroduce hard throws there.
- `pnpm-workspace.yaml` overrides exclude non-linux-x64 platform binaries (Replit-specific). This is intentional and harmless on Vercel/GitHub Actions (linux-x64). macOS devs need to remove those overrides locally.
- `@assets` alias in vite.config.ts → `../../attached_assets` (root dir). Keep `attached_assets/` committed.

## API URL pattern
- `artifacts/mawibo/src/lib/api-url.ts` exports `API_BASE_URL` and `apiUrl()` helper.
- `main.tsx` calls `setBaseUrl(API_BASE_URL || null)` for generated React Query hooks.
- Direct fetch calls (login, register, ai-hub) use `apiUrl()` helper.
- Priority: `VITE_API_URL` env var → same-origin fallback.

## Auth
- Token format: `mawibo-<userId>` (no JWT signing — planned improvement)
- `DEFAULT_USER_ID = 1` hardcoded in all API routes — placeholder; proper per-request auth extraction is a planned improvement.
- Passwords: `scrypt` + 16-byte random salt, stored as `salt:hash` in `passwordHash` column.

## Vercel deployment
- **Frontend**: root `vercel.json` → builds `@workspace/mawibo`, outputs to `artifacts/mawibo/dist/public`, rewrites non-file paths to `/index.html`.
- **API**: `artifacts/api-server/vercel.json` → build via esbuild bundle, `api/index.ts` re-exports Express app.
- Two separate Vercel projects is the recommended approach for this monorepo.

**Why:** The monorepo workspace packages export `.ts` directly (no pre-build step), so the Vite build bundles them inline. The API uses esbuild to bundle to a single `.mjs` file.
