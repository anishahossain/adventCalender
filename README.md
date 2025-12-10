🎄 Advent Calendar Builder

Full-Stack Developer • React • Vite • Node.js • Python (Planned)
Status: In Progress

###📌 Overview

The Advent Calendar Builder is a fully custom, interactive web application that lets users design and share personalized 7-day digital advent calendars. It features a polished onboarding flow, animated UI, fake-auth scaffolding, and a step-by-step creation wizard that guides users from signup → dashboard → calendar editing → sharing.

This project is designed for portfolio-level front-end + full-stack architecture, with future integration points for a Node.js API and Python microservices.

🌟 Features (In Progress)
* ✅ Phase 0 — Authentication Shell

Custom AuthLayout with animated gradient background

Adobe Fonts (Hagrid) + hero graphics

/signup and /login pages with fake auth (localStorage)

/app placeholder dashboard

* 🚀 Phase 1 — User Dashboard (/app) (Current Work)

Personalized greeting: “Hi, Anisha 👋”

CTA cards:

Create a New Advent Calendar

Your Calendars (Draft / Live)

LocalStorage or in-memory data for calendars

Draft calendars show:
Status • Type (7-day) • Edit • Preview

* 🧰 Phase 2 — Calendar Creation Wizard (/create)

Wizard to set:

Title

Description

Theme

Share toggle (UI only for now)

Grid of 7 days (small cards)

Clicking a day card → opens editor for that day

On submit: generate fake ID, redirect → /calendar/:id/edit

* 🎨 Phase 3 — Calendar Editor (/calendar/:id/edit)

Main “builder” UI

Selectable day tiles

Side drawer Day Editor:

Day title

Text content

Image upload / URL

“Preview this day”

Calendar stored in state or localStorage

* 🌍 Phase 4 — Share & Public View

4A — Share Panel

“Share Calendar” button

Fake URL generation (/view/abcd1234)

One-click copy

4B — Public Viewer (/view/:slug)

Open-to-everyone read-only calendar view

Receiver-focused styling

Click day → modal opens with that day’s content

⚙️ Phase 5 — Optional Profile Page

Basic user settings

Placeholder for future backend integration

* 💎 Phase 6 — Polish & UX

Responsive layout

Smooth hover animations

Fade/scale transitions when opening a day

Loading states when navigating pages

* 🗄️ Phase 7 — Backend & Database (Planned)

Replace fake auth with JWT sessions

Store calendars in real DB

Python microservice for:

Auto-generating content

Email notifications

Analytics

* 🧱 Tech Stack
Frontend

React (hooks + context)

Vite (lightning-fast dev environment)

Tailwind / custom CSS

Adobe Fonts + animated gradients

Framer Motion (planned polish)

Backend (Planned)

Node.js Express API

JWT authentication

PostgreSQL or MongoDB

Python microservices for AI-generated content

Tooling

Git (structured branching)

SSH + multi-server architecture (planned)

LocalStorage mock backend

📂 Project Structure (Simplified)
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

📸 Screenshots (Add Later)

PLACEHOLDER — Screenshot 1: Auth Layout

PLACEHOLDER — Screenshot 2: Dashboard

PLACEHOLDER — Screenshot 3: Calendar Editor

🧪 Development Setup
git clone <your-repo-url>
cd advent-calendar-builder
npm install
npm run dev

📝 Roadmap

 Finish Phase 1 Dashboard

 Build create wizard

 Build calendar editor

 Add share modal

 Implement public viewer

 Add profile page

 Add backend authentication

 Add AI/Python auto-content generator

👩‍💻 About the Developer

Built by Anisha Hossain — Full-Stack Developer & Research Assistant, focusing on interactive design, React architecture, and full-stack product development.
