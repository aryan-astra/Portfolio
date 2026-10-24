<!-- BEGIN:nextjs-agent-rules -->
# Portfolio maintenance

- Next.js 16.4.3, React 19, npm lockfile, static export. Use npm ci; do not migrate runtimes.
- English root: app/(en). Russian root: app/ru, text-first, no client runtime in exported HTML. Frozen original: public/og; never restyle it or overwrite it. Run npm run archive:check.
- Preserve verified project facts. Arch stack was corrected against upstream source; all other descriptions retain owner-provided claims. Record evidence before altering them.
- GPG-sign every implementation commit: git commit -S. No attribution trailers. Never rewrite history or promote production without a release decision.
- Use @phosphor-icons/react exclusively. Prefer native interactions; any animation must respect reduced motion. Check pointer:fine before hover/cursor effects and provide touch/keyboard alternatives.
- ButterflyBackground remains optional and is not mounted in the redesigned root.
- Validate with npm run lint, npm test, npm run build, npm run test:e2e. Build validates content, archive hashes, routes, and locale output.
- Publishing and limitations: docs/publishing.md, docs/localization.md, docs/redesign.md. Notion destination is undecided; do not invent content or create a workspace database.
- The user adopted the complete redesign brief, including signed commits and preview deployments. Keep production unchanged during preview review.
<!-- END:nextjs-agent-rules -->
