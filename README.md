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
  <img width="800" alt="Phase 2 Day Editing" src="https://github.com/user-attachments/assets/52b328c9-e9e1-48eb-8d02-1d65bc4749ef" />
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/313383fa-284d-4cba-a082-6850b93ad6f9" />
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/40b0f8ef-b8c0-49b1-8d40-ee490dfb092a" />
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/5af0714b-a8c9-431b-be9c-18f65aa1b3b5" />
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/5a9dba41-babb-4e7e-936c-804d2c5fda46" />
  <img width="800" alt="image" src="https://github.com/user-attachments/assets/51246007-89df-4234-8fc5-3f2b679ec148" />






- Phase 3 — Finish day editors 3–7: Special Song, Book rec, Virtual flowers, A product link, Favorite memory.
- Phase 4 — Sharing & Public View: share panel with generated link (`/view/slug`), one-click copy, read-only public viewer with modal per day and receiver-focused styling.
- Phase 5 — Profile: basic user settings and hooks for backend integration.
- Phase 6 — Polish & UX: responsive layout, smooth hover states, fade/scale transitions, loading states between pages.
- Phase 7 — Backend & Database: replace fake auth with JWT, persist calendars in DB (PostgreSQL/MongoDB), Python services for auto-content, email, analytics.

## Tech Stack
- Frontend: React (hooks + context), Vite, Tailwind/custom CSS, Adobe Fonts, Framer Motion (planned).
- Backend (planned): Node.js + Express, JWT auth, PostgreSQL or MongoDB, Python microservices for AI/content.
- Tooling: Git, SSH/multi-server-ready architecture, localStorage mock backend.

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
npm run dev
```

## Roadmap (next up)
- Finish Phase 1 dashboard polish and data wiring.
- Build creation wizard and editor flows.
- Add share modal + public viewer.
- Layer profile page + backend auth.
- Integrate AI/Python auto-content generator.


Todo:
- Calendar editor

## About the Developer
Built by Anisha Hossain - Full-Stack Developer & Research Assistant focused on interactive design, React architecture, and full-stack product development.
