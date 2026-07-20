# MAWIBO — AI-Powered Healthcare Super App

**My AI Wellness & Better Outcomes** — Africa's most advanced AI-powered health platform, built for Liberia and West Africa.

[![CI](https://github.com/your-org/mawibo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/mawibo/actions/workflows/ci.yml)

---

## What is MAWIBO?

MAWIBO connects Liberian citizens to healthcare services through one intelligent platform:

- 🤖 **AI Health Mate** — Symptom analysis, triage, medical education (powered by GPT-4o-mini)
- 🩺 **Doctor Marketplace** — Search by specialty, county, availability, and fee
- 📋 **Digital Health Records** — Lifetime records: diagnoses, prescriptions, lab results
- 💊 **Pharmacy Ecosystem** — Medicine search, price comparison, home delivery
- 🧪 **Laboratory Network** — Test booking, home collection, result upload
- 🏥 **Hospital Directory** — Complete database with maps and navigation
- 🧠 **Mental Health** — Coaching, anxiety support, mood tracking
- 💪 **Fitness & Nutrition** — Personalized plans with local West African foods
- 🤰 **Women's & Child Health** — Maternal and paediatric care
- 🛡️ **Insurance Management** — Claims, coverage, provider network
- 🔬 **50+ AI Tools** — Hub of specialized health AI tools
- 📊 **Disease Surveillance** — Public health monitoring dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces, Node.js 20, TypeScript 5.9 |
| Frontend | React 19, Vite 7, Tailwind CSS v4, Framer Motion |
| Backend | Express 5, Pino logger |
| Database | PostgreSQL + Drizzle ORM |
| AI | OpenAI GPT-4o-mini (streaming) |
| API codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Build | esbuild (API), Vite (frontend) |

---

## Project Structure

```
mawibo/
├── artifacts/
│   ├── mawibo/          # React frontend (Vite)
│   └── api-server/      # Express API server
├── lib/
│   ├── db/              # PostgreSQL schema + Drizzle ORM
│   ├── api-spec/        # OpenAPI specification (source of truth)
│   ├── api-zod/         # Generated Zod schemas (from OpenAPI)
│   └── api-client-react/# Generated React Query hooks (from OpenAPI)
├── vercel.json          # Frontend Vercel deployment config
├── .env.example         # Required environment variables
└── .github/workflows/   # CI/CD pipelines
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

### 1. Clone & Install

```bash
git clone https://github.com/your-org/mawibo.git
cd mawibo
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `SESSION_SECRET` | Random 32+ character string |

### 3. Set up the database

```bash
pnpm --filter @workspace/db run push
```

### 4. Start development

```bash
# Terminal 1 — API server (port 3001)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 3000)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mawibo run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run build` | Typecheck + build all packages |
| `pnpm run typecheck` | Full TypeScript check |
| `pnpm --filter @workspace/mawibo run dev` | Start frontend dev server |
| `pnpm --filter @workspace/api-server run dev` | Start API dev server |
| `pnpm --filter @workspace/db run push` | Push DB schema (dev) |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks from OpenAPI spec |

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

### Quick deploy to Vercel (frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/mawibo)

Set these environment variables in your Vercel project:
- `VITE_API_URL` — your deployed API URL (if separate)

### Deploy API to Railway / Render

The API server (`artifacts/api-server`) is a standard Node.js Express app. Deploy it to any platform that supports Node.js, then set:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `SESSION_SECRET`
- `CORS_ORIGIN` — your frontend URL
- `NODE_ENV=production`
- `PORT` — provided by platform

---

## Environment Variables

See [.env.example](./.env.example) for a complete reference with descriptions.

---

## Architecture Notes

- **Auth**: Token-based (localStorage). Token format: `mawibo-<userId>`. Passwords are hashed with `scrypt` + random salt.
- **AI Chat**: Server-Sent Events (SSE) streaming via OpenAI SDK.
- **API codegen**: Edit `lib/api-spec/src/openapi.yaml`, then run `pnpm --filter @workspace/api-spec run codegen` to regenerate TypeScript types and React Query hooks.
- **Default user**: Routes currently use `DEFAULT_USER_ID = 1` as a placeholder. Proper per-request auth extraction is a planned improvement.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

CI will automatically run type checks and build verification on your PR.

---

## License

MIT © MAWIBO Health Technologies
