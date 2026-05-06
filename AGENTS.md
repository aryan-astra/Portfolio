<!-- BEGIN:nextjs-agent-rules -->
# Portfolio Redesign - Phase Completion Status

## Completed (15/15 Phases)
- ✅ **Phase 0**: Setup verified (npm install, build check, @phosphor-icons/react)
- ✅ **Phase 1**: lib/data.ts with 7 projects (2 featured, 5 main), 3 blog posts, hackathons
- ✅ **Phase 2**: AsciiFlowerLoader with ASCII bloom, 2.8s display + 0.6s exit fade
- ✅ **Phase 3**: ButterflyBackground cursor trail (canvas-based, 28 particle max, head glows blue)
- ✅ **Phase 4**: CustomCursor with 12px circle, 0.15 lerp lag, dark/light mode support
- ✅ **Phase 5**: Hero terminal with 13 commands (help, whoami, ls, open, stack, etc.)
- ✅ **Phase 6**: Projects grid (featured/main/secondary tiers with tiered display)
- ✅ **Phase 7**: Writing index at /writing with blog posts as SSG routes
- ✅ **Phase 8**: PixelOctopus pink gradient redesign (efe9fe→d53f8c) with roaming AI
- ✅ **Phase 9**: Icon migration complete (all lucide-react → @phosphor-icons/react)
- ✅ **Phase 10**: SEO sitemap generation (15 routes, featured projects prioritized)
- ✅ **Phase 11**: robots.txt and metadata setup
- ✅ **Phase 12**: Mobile hamburger overlay (md breakpoint hamburger/close toggle)
- ✅ **Phase 13**: Animation audit (prefers-reduced-motion compliance on cursor-blink)
- ✅ **Phase 14**: Build verification (0 errors, 16 routes pre-rendered)
- ⏳ **Phase 15**: This file (AGENTS.md) update
- ⏳ **Phase 16**: Push to GitHub + create PR (pending explicit user approval)

## Technical Foundation
- **Next.js 16.2.4**: App Router, Turbopack, static export (output: "export")
- **Tailwind v4**: CSS custom properties, no @apply outside globals.css
- **@phosphor-icons/react v2.1.10**: Exclusive icon library, Regular weight
- **Framer Motion**: All animations with mandatory prefers-reduced-motion compliance
- **Color System**: Monochrome + accent (light #2563EB / dark #3B82F6)
- **Git**: All commits GPG-signed, no AI attribution trailers

## Active Development Notes
- Removed: PixelBloomField.tsx, FloatingFlowers.tsx, HalftoneEyes.tsx, AsciiEye.tsx
- Terminal UI stays lean: no decorative overlays except ButterflyBackground (optional)
- Mobile: hamburger toggle at md breakpoint, smooth scroll with reduced-motion support
- OG image deferred (Phase 10 partial) — basic sitemap.xml generated instead

## Next Agent Instructions
1. Do NOT modify lib/data.ts project descriptions without verification
2. Maintain GPG-signed commits: `git commit -S -m "type(scope): description"`
3. All new components must check `(pointer: fine)` for mobile-safe interactions
4. Use @phosphor-icons/react exclusively; no lucide-react or other icon libraries
5. Test animations in dev with prefers-reduced-motion: reduce before shipping
6. Keep ButterflyBackground optional/toggleable; don't make it mandatory render
<!-- END:nextjs-agent-rules -->
