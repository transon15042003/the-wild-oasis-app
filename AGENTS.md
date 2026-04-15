# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is **The Wild Oasis Website**, a customer-facing Next.js 14 cabin booking application. It uses the App Router pattern, Supabase for data/storage, and NextAuth v5 (beta) with Google OAuth for authentication. See `README.md` and `package.json` for standard commands.

### Required Environment Variables

A `.env.local` file must exist at the repo root with:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL (hardcoded in `next.config.mjs` as `qsmwnmhfoijnnmbyjvcn.supabase.co`) |
| `SUPABASE_KEY` | Supabase anon/service key |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `AUTH_SECRET` | NextAuth.js secret |
| `NEXTAUTH_URL` | Base URL, typically `http://localhost:3000` |

### Running Services

- **Dev server**: `npm run dev` — starts on port 3000.
- No local database; all data is in a remote Supabase instance.
- No Docker or docker-compose required.

### Key Caveats

- `npm run build` will fail with placeholder Supabase credentials because `generateStaticParams` in `/app/api/cabins/[cabin_id]/route.js` fetches cabin data at build time. The dev server (`npm run dev`) works fine with placeholders for pages that don't require Supabase data.
- The Cabins page and any data-dependent pages will show errors without valid Supabase credentials; other pages (Home, About, Login) render normally.
- No automated test suite exists in this codebase. Lint is the primary code quality check: `npm run lint`.
- The project uses npm (has `package-lock.json`). Node.js >= 18.17 is required.
