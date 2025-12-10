# 🎄 Advent Calendar Builder

Interactive, portfolio-ready web app for crafting and sharing 7-day digital advent calendars. Built for a polished onboarding-to-builder journey with future hooks for Node.js and Python services.

## Status
- In progress; current focus on Phase 1 (Dashboard)
<img width="2620" height="1468" alt="image" src="https://github.com/user-attachments/assets/d807b546-d1f5-4ceb-aa9b-6a9ecc7f9d6e" />

- Planned: Node.js API + Python microservices for AI content and notifications

## Overview
Design and share custom advent calendars through a guided flow: auth → dashboard → calendar creation → editing → public sharing. The UX emphasizes animated gradients, playful typography, and clear CTAs while keeping fake-auth and data in the front end for rapid iteration.

## Feature Phases
- ✅ Phase 0 — Authentication shell: animated gradient AuthLayout, Adobe Fonts (Hagrid), `/signup` + `/login` with localStorage-backed fake auth, placeholder `/app`.
- 🚀 Phase 1 — Dashboard (`/app`, current): greeting (“Hi, Anisha 👋”), CTA cards for “Create a New Advent Calendar” and “Your Calendars”, in-memory/localStorage draft data with status/type/edit/preview actions.
- 🧰 Phase 2 — Creation Wizard (`/create`): set title, description, theme, share toggle (UI), 7-day grid, day-card editor, submit to generate fake ID then redirect to `/calendar/:id/edit`.
- 🎨 Phase 3 — Calendar Editor (`/calendar/:id/edit`): builder UI with selectable day tiles, side drawer day editor (title, text, image upload/URL, preview), state/localStorage storage.
- 🌍 Phase 4 — Sharing & Public View: share panel with generated link (`/view/slug`), one-click copy, read-only public viewer with modal per day and receiver-focused styling.
- ⚙️ Phase 5 — Profile: basic user settings and hooks for backend integration.
- 💎 Phase 6 — Polish & UX: responsive layout, smooth hover states, fade/scale transitions, loading states between pages.
- 🗄️ Phase 7 — Backend & Database: replace fake auth with JWT, persist calendars in DB (PostgreSQL/MongoDB), Python services for auto-content, email, analytics.

## Tech Stack
- Frontend: React (hooks + context), Vite, Tailwind/custom CSS, Adobe Fonts, Framer Motion (planned).
- Backend (planned): Node.js + Express, JWT auth, PostgreSQL or MongoDB, Python microservices for AI/content.
- Tooling: Git, SSH/multi-server-ready architecture, localStorage mock backend.

## Project Structure (simplified)
```
/src
  /components
  /pages
    auth/
    app/
    create/
    editor/
    public/
  /context
  /hooks
  /utils
```

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

## Screenshots (todo)
- Auth layout
- Dashboard
- Calendar editor

## About the Developer
Built by Anisha Hossain - Full-Stack Developer & Research Assistant focused on interactive design, React architecture, and full-stack product development.
