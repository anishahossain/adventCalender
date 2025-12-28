# 🎄 Advent Calendar Builder (deployed)
## view it here: https://advent-calender-psi.vercel.app/signup
Interactive, portfolio-ready web app for crafting and sharing 7-day digital advent calendars. Built for a polished onboarding-to-builder journey with future hooks for Node.js and Python services.

## Status
- Completed and deployed-ready
- Full backend + sharing flow with view-only recipients

## Overview
Design and share custom advent calendars through a guided flow: auth → dashboard → calendar creation → editing → publish/share → public view. The UX emphasizes animated gradients, playful typography, and clear CTAs with a production-ready backend and share tokens.

## Feature Phases
- ✅ Phase 0 — Authentication shell: animated gradient AuthLayout, Adobe Fonts (Hagrid), `/signup` + `/login` with localStorage-backed fake auth, placeholder `/app`.

- ✅ Phase 1 — Dashboard (`/app`, current): greeting hero, CTA card for “Create a New Advent Calendar”, localStorage-seeded draft data, edit/preview/share actions, and a dedicated “Your Calendars” page at `/app/calendars`.

- ✅ Phase 2 — Creation + day editing: `/app/create`, `/app/calendars/:id/edit` 7‑day dashboard, Day 1 (Message) editor with background presets, Day 2 (Picture) editor with upload + preview, day preview screen, Postgres persistence.

- ✅ Phase 3 — Finish day editors 3–7: Special Song, Book rec, Virtual flowers, A product link, Favorite memory.
- ✅ Phase 4 — Backend implementation after day functionality: stabilize API, data integrity, and persistence flows.
- ✅ Phase 5 — Authorization and account storage: auth flows, user profiles, permissions.
- ✅ Phase 6 — Sharing & Public View: publish/unpublish, generated share token, one-click copy, read-only public viewer with per-day routes and recipient-focused styling.
- ✅ Phase 7 — Deployment: environment setup, hosting, and production configs.
- ✅ Phase 8 — Profile: basic user settings and hooks for backend integration.
- ✅ Phase 9 — Polish & UX: responsive layout, hover states, share effects, loading states between pages.

## Tech Stack
- Frontend: React (hooks), Vite, custom CSS, Adobe Fonts.
- Backend: Node.js + Express, PostgreSQL (JSONB days).
- Tooling: Git, localStorage offline cache, pg driver.

## Database Schema
- tables: `users`, `calendars`
- calendars columns: `id` (PK), `user_id` (FK), `name`, `description`, `type`, `days` (JSONB), `status`, `share_token`, `is_published`, `published_at`, `updated_at`
- users columns: `id` (PK), `username`, `password_hash`, `created_at`

## Key Routes
- `/signup` and `/login`: auth shell, both redirect to `/app`
- `/app`: landing dashboard (CTA, hero, entry point)
- `/app/calendars`: calendars list
- `/app/create`: create new calendar details
- `/app/calendars/:id/edit`: 7‑day dashboard for a calendar
- `/app/calendar/:id/share`: owner share screen (publish/unpublish/regenerate)
- `/app/calendar/day/1/edit` – `/app/calendar/day/7/edit`: per‑day editors
- `/app/calendar/day/:id/preview`: read‑only day preview
- `/share/:shareToken`: public, view-only calendar
- `/share/:shareToken/day/:dayId`: public, view-only day

## Development
```bash
git clone <your-repo-url>
cd adventCalender
npm install
frontend:
cd client 
npm run dev
backend:
node server_node/src/index.js
```

## Deployment
Backend (Render):
- Root: `server_node`
- Build: `npm install`
- Start: `node src/index.js`
- Env vars: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`

Frontend (Vercel):
- Root: `client`
- Build: `npm run build`
- Output: `dist`
- Env vars: `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`

Vercel SPA routing:
- `client/vercel.json` rewrites all paths to `index.html` for `/share/:token` routes.

## About the Developer
Built by Anisha Hossain - Full-Stack Developer & Research Assistant focused on interactive design, React architecture, and full-stack product development.
