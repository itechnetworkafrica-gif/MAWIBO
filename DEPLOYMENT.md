# MAWIBO — Deployment Guide

This guide covers deploying MAWIBO to GitHub and Vercel.

---

## GitHub Setup

### 1. Create a GitHub repository

```bash
git init
git add .
git commit -m "feat: initial MAWIBO production build"
git remote add origin https://github.com/your-org/mawibo.git
git push -u origin main
```

### 2. Set repository secrets (for CI)

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `SESSION_SECRET` | Random 32+ char string |

The CI workflow (`ci.yml`) uses placeholder values for the build step — only add real secrets if you add deployment steps to the workflow.

---

## Vercel Deployment — Frontend

The root `vercel.json` configures the frontend for one-click Vercel deployment.

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects the root `vercel.json` — no framework override needed
4. Set environment variables (see below)
5. Click **Deploy**

### Frontend environment variables (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | If API is separate | Full URL of deployed API, e.g. `https://mawibo-api.railway.app` |
| `NODE_ENV` | Yes | Set to `production` |

**Note**: If you deploy both frontend and API to the same Vercel project or domain, `VITE_API_URL` can be omitted and the app will use same-origin API calls.

---

## Vercel Deployment — API Server

The `artifacts/api-server` directory has its own `vercel.json` for standalone API deployment.

### Deploy API separately

```bash
cd artifacts/api-server
vercel --prod
```

Or in the Vercel dashboard, import the repo and set the **Root Directory** to `artifacts/api-server`.

### API environment variables (Vercel / any platform)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key |
| `SESSION_SECRET` | ✅ Yes | Random 32+ char string |
| `NODE_ENV` | ✅ Yes | `production` |
| `CORS_ORIGIN` | Recommended | Frontend URL(s), comma-separated |
| `LOG_LEVEL` | No | `info` (default) |

---

## Alternative: Railway (recommended for API)

Railway is an excellent host for Express + PostgreSQL apps.

1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Add a **PostgreSQL** service — Railway auto-sets `DATABASE_URL`
3. Set service variables: `OPENAI_API_KEY`, `SESSION_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN`
4. Set **Root directory** to `artifacts/api-server`
5. Set **Start command** to `pnpm run start`
6. Railway will run `pnpm install` and `pnpm run build` automatically

After deployment, copy the Railway URL into Vercel's `VITE_API_URL` environment variable.

---

## Database Setup

### Provision a PostgreSQL database

**Neon** (recommended for Vercel):
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (with `?sslmode=require`)
3. Set it as `DATABASE_URL`

**Supabase**:
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project → Settings → Database
3. Copy the connection string

### Push schema

After setting `DATABASE_URL`:

```bash
pnpm --filter @workspace/db run push
```

This runs `drizzle-kit push` and creates all tables.

---

## Environment Variables Quick Reference

```bash
# Copy and fill in your values
DATABASE_URL=postgresql://user:password@host:5432/mawibo?sslmode=require
OPENAI_API_KEY=sk-...
SESSION_SECRET=<random-32-char-string>
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
VITE_API_URL=https://your-api.railway.app
```

Generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Troubleshooting

### Build fails: "PORT environment variable is required"
- The `PORT` env var is only needed for the dev server, not the build. The updated `vite.config.ts` handles this — ensure you have the latest code.

### API returns 404
- Confirm `VITE_API_URL` points to your deployed API server
- Check that `NODE_ENV=production` is set on the API server

### Database connection errors
- Verify `DATABASE_URL` is correct and the database is accessible
- For Neon/Supabase: ensure `?sslmode=require` is appended to the connection string
- Run `pnpm --filter @workspace/db run push` to create tables

### CORS errors in browser
- Set `CORS_ORIGIN` on the API server to the exact frontend URL (no trailing slash)
- Example: `CORS_ORIGIN=https://mawibo.vercel.app`

### OpenAI features not working
- Verify `OPENAI_API_KEY` is set on the API server
- Check API server logs for OpenAI-related errors

### pnpm install fails locally on macOS/Windows
- The `pnpm-workspace.yaml` contains Linux-optimized overrides for Replit compatibility
- On Mac: `pnpm install --ignore-scripts` then rebuild native deps as needed
- These overrides do not affect Vercel or GitHub Actions (both run Linux x64)
