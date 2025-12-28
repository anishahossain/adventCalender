# 🎄 Advent Calendar Builder

Interactive, portfolio-ready web app for crafting and sharing 7-day digital advent calendars. Built for a polished onboarding-to-builder journey with future hooks for Node.js and Python services.

## Status
- In progress: Phase 2 (calendar creation + day editing) is active
- Data now persists in Postgres with localStorage as offline cache

## Overview
Design and share custom advent calendars through a guided flow: auth → dashboard → calendar creation → editing → public sharing. The UX emphasizes animated gradients, playful typography, and clear CTAs while keeping fake-auth and data in the front end for rapid iteration.

## Feature Phases
- ✅ Phase 0 — Authentication shell: animated gradient AuthLayout, Adobe Fonts (Hagrid), `/signup` + `/login` with localStorage-backed fake auth, placeholder `/app`.
  <img width="1200" alt="Phase 0 Auth" src="https://github.com/user-attachments/assets/189d9df6-4a7a-4d7d-829d-9dcd42750bb9" />

- ✅ Phase 1 — Dashboard (`/app`, current): greeting hero, CTA card for “Create a New Advent Calendar”, localStorage-seeded draft data, edit/preview/share actions, and a dedicated “Your Calendars” page at `/app/calendars`.
  <img width="1200" alt="Phase 1 Dashboard" src="https://github.com/user-attachments/assets/2b6b52d3-4db7-4635-b2e7-60d6d7392bce" />

- ✅ Phase 2 — Creation + day editing: `/app/create`, `/app/calendars/:id/edit` 7‑day dashboard, Day 1 (Message) editor with background presets, Day 2 (Picture) editor with upload + preview, day preview screen, Postgres persistence.

- ✅ Phase 3 — Finish day editors 3–7: Special Song, Book rec, Virtual flowers, A product link, Favorite memory.
- ✅ Phase 4 — Backend implementation after day functionality: stabilize API, data integrity, and persistence flows.
- ✅ Phase 5 — Authorization and account storage: auth flows, user profiles, permissions.
- Phase 6 — Sharing & Public View: share panel with generated link (`/view/slug`), one-click copy, read-only public viewer with modal per day and receiver-focused styling.
- Phase 7 — Deployment: environment setup, hosting, and production configs.
- Phase 8 — Profile: basic user settings and hooks for backend integration.
- Phase 9 — Polish & UX: responsive layout, smooth hover states, fade/scale transitions, loading states between pages.

## Tech Stack
- Frontend: React (hooks), Vite, custom CSS, Adobe Fonts.
- Backend: Node.js + Express, PostgreSQL (JSONB days).
- Tooling: Git, localStorage offline cache, pg driver.

## Databse Schema
- there are two public tables: users and calendars
- calenders table with columns: id (PK), name, description, type, days, status, updated_at
- users table with columns: id (PK), username, password_hash, created_at
- The calendars.user_id column has a foreign key to users.id, which enforces that every calendar belongs to a valid user

## Key Routes
- `/signup` and `/login`: auth shell, both redirect to `/app`
- `/app`: landing dashboard (CTA, hero, entry point)
- `/app/calendars`: calendars list
- `/app/create`: create new calendar details
- `/app/calendars/:id/edit`: 7‑day dashboard for a calendar
- `/app/calendar/day/1/edit` – `/app/calendar/day/7/edit`: per‑day editors
- `/app/calendar/day/:id/preview`: read‑only day preview

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

## Roadmap (next up)
- Phase 6 — Sharing & Public View: share panel with generated link (`/view/slug`), one-click copy, read-only public viewer with modal per day and receiver-focused styling.

Todo:
- Calendar Sharing

## About the Developer
Built by Anisha Hossain - Full-Stack Developer & Research Assistant focused on interactive design, React architecture, and full-stack product development.
