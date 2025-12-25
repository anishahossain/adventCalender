# 🎄 Advent Calendar Builder

Interactive, portfolio-ready web app for crafting and sharing 7-day digital advent calendars. Built for a polished onboarding-to-builder journey with future hooks for Node.js and Python services.

## Status
- In progress; Phase 1 (Dashboard + Calendars page) is active
- Planned: Node.js API + Python microservices for AI content and notifications

## Overview
Design and share custom advent calendars through a guided flow: auth → dashboard → calendar creation → editing → public sharing. The UX emphasizes animated gradients, playful typography, and clear CTAs while keeping fake-auth and data in the front end for rapid iteration.

## Feature Phases
- ✅ Phase 0 — Authentication shell: animated gradient AuthLayout, Adobe Fonts (Hagrid), `/signup` + `/login` with localStorage-backed fake auth, placeholder `/app`.
- 🚀 Phase 1 — Dashboard (`/app`, current): greeting hero, CTA card for “Create a New Advent Calendar”, localStorage-seeded draft data, edit/preview/share actions, and a dedicated “Your Calendars” page at `/app/calendars`.
- 🧰 Phase 2 — Landing page created; currently working on the existing calendars dashboard.
- 🎨 Phase 3 — Build a new calendar dashboard: creation flow and builder UI (planned).
- 🌍 Phase 4 — Sharing & Public View: share panel with generated link (`/view/slug`), one-click copy, read-only public viewer with modal per day and receiver-focused styling.
- ⚙️ Phase 5 — Profile: basic user settings and hooks for backend integration.
- 💎 Phase 6 — Polish & UX: responsive layout, smooth hover states, fade/scale transitions, loading states between pages.
- 🗄️ Phase 7 — Backend & Database: replace fake auth with JWT, persist calendars in DB (PostgreSQL/MongoDB), Python services for auto-content, email, analytics.

## Tech Stack
- Frontend: React (hooks + context), Vite, Tailwind/custom CSS, Adobe Fonts, Framer Motion (planned).
- Backend (planned): Node.js + Express, JWT auth, PostgreSQL or MongoDB, Python microservices for AI/content.
- Tooling: Git, SSH/multi-server-ready architecture, localStorage mock backend.

## Key Routes (Phase 1)
- `/signup` and `/login`: auth shell, both redirect to `/app`
- `/app`: landing dashboard (CTA, hero, entry point)
- `/app/calendars`: calendars list
- `/app/create`: placeholder create flow
- `/app/calendar/:id/edit`, `/preview`, `/share`: placeholders

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

## Screenshots
Add Phase 0 screenshot here (replace the file with your new image):

![Phase 0 Auth](docs/screenshots/phase0-auth.png)

Add Phase 1 screenshot here (replace the file with your new image):

![Phase 1 Dashboard](docs/screenshots/phase1-dashboard.png)

Todo:
- Calendar editor

## About the Developer
Built by Anisha Hossain - Full-Stack Developer & Research Assistant focused on interactive design, React architecture, and full-stack product development.
