# Aryan Shukla — Portfolio

Personal developer portfolio. Built with Next.js 16, Tailwind CSS v4, Framer Motion, and shadcn/ui.

## Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Animations:** Framer Motion (scroll-triggered, non-looping)
- **Fonts:** Instrument Serif (display) + DM Sans (body) via `next/font/google`
- **Theme:** Monochrome — light/dark toggle, persisted to `localStorage`
- **Deployed on:** Vercel → `aryans.is-a.dev`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Project structure

```
app/
  layout.tsx        — Root layout, fonts, metadata
  page.tsx          — Assembles all sections
  globals.css       — Design tokens, Tailwind v4 theme
components/
  Navbar.tsx        — Sticky nav with scroll-aware border
  Footer.tsx        — Minimal footer
  ThemeToggle.tsx   — Light/dark toggle
  sections/
    Hero.tsx
    Projects.tsx
    Skills.tsx
    Hackathons.tsx
    Contact.tsx
lib/
  data.ts           — All site content (projects, skills, hackathons)
  utils.ts          — cn() helper
```

## Content

All site content lives in `lib/data.ts`. To update projects, skills, or hackathon entries, edit that file — no other files need to change.

## License

All rights reserved. Not open for reuse without permission.