# Aryan Shukla — Portfolio

An editorial portfolio and growing knowledge garden. Next.js 16.4.3 App Router, React 19, Tailwind v4, Phosphor icons, static export. English uses warm paper, charcoal, blue, Fraunces/Inter/JetBrains Mono and small native interactions. Russian is a separate text-first document with no shipped client runtime. The original site is frozen under `/og`.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run preview
npm run test:e2e
```

Development: http://localhost:3000. Static preview: http://127.0.0.1:4173. Browser tests use installed Google Chrome. `npm run build` validates content and the frozen archive, exports pages, removes unpublished sentinels, strips Russian runtime scripts, and verifies static routes. Do not use `next start` with static export.

Routes: `/`, `/writing`, `/projects/[slug]`, `/resume`, `/garden`, `/garden/[slug]`, `/search`, `/notes`, `/notes/[slug]`, `/library`, `/library/[shelf]`, `/privacy`, `/feed.xml`, `/ru`, `/og`.

Content: `lib/data.ts` holds existing owner-provided projects/articles; `lib/ru.ts` holds translations; `lib/concepts.ts` holds conservative concept aliases; `content/notion-posts.json` holds validated editorial snapshots. Graph, search, and backlinks derive from these sources. Books, films, people, and notes stay empty until actual reviewed content is supplied.

Read [architecture and delivery notes](docs/redesign.md), [publishing](docs/publishing.md), [localization](docs/localization.md), and [archive/rollback](docs/archive.md). Production remains https://aryans.is-a.dev until an explicit release decision. No paid service or visitor tracker was activated.

All rights reserved. Not open for reuse without permission.
