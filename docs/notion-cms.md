# Notion-backed CMS — Setup Guide

> **Status:** specification only. No runtime integration has been added yet.
> This document describes how to wire up the `/writing` route to a Notion
> database so future posts can be authored in Notion and pulled in at
> build time.

## Why a build-time sync (not runtime)

The site is statically exported (`next.config.ts → output: "export"`),
so any Notion calls must happen **before** `next build`. The chosen
pattern is a small Node script (`scripts/sync-notion.mjs`) that runs as
a `prebuild` step, fetches the database, converts each page to JSON,
and writes the result to `lib/notion-posts.json`. The existing
`app/writing/[slug]/page.tsx` route then reads that file at build time
the same way it already reads `lib/data.ts`.

## Data flow

```
   ┌────────────────────┐   prebuild script    ┌──────────────────────┐
   │  Notion database   │ ───────────────────► │ lib/notion-posts.json│
   │  (single source    │   @notionhq/client   │  (committed or       │
   │   of truth)        │   notion-to-md       │   git-ignored)       │
   └────────────────────┘                      └──────────┬───────────┘
                                                          │
                                                          ▼
                                              ┌────────────────────────┐
                                              │  app/writing/[slug]    │
                                              │   page.tsx (SSG)       │
                                              └────────────────────────┘
```

## Notion database schema

Create a Notion database (full-page, not inline) with these properties:

| Property      | Type        | Notes                                                       |
|---------------|-------------|-------------------------------------------------------------|
| `Title`       | Title       | Required. The visible post title.                           |
| `Slug`        | Rich text   | Required. URL slug (e.g. `building-modus`).                 |
| `Excerpt`     | Rich text   | Optional. ≤ 200 chars. Shown on the listing page.           |
| `Tags`        | Multi-select| Optional. Used for filtering / chips.                       |
| `PublishedAt` | Date        | Required. Drives sort order.                                |
| `Status`      | Select      | One of `Draft`, `Published`, `Archived`. Only `Published` is included.|
| `Cover`       | Files       | Optional. Used for `<meta property="og:image">`.            |
| `ReadingTime` | Number      | Optional. Minutes. If omitted, computed from content length.|

## Block → JSX mapping

The sync script uses `notion-to-md` to flatten Notion blocks into
Markdown, then a small renderer (to be added in
`components/MdxRenderer.tsx`) maps it back to JSX:

| Notion block        | Rendered as                                        |
|---------------------|----------------------------------------------------|
| `paragraph`         | `<p>` (with link/inline-code/bold preserved)       |
| `heading_1/2/3`     | `<h2>` / `<h3>` / `<h4>` (h1 reserved for title)   |
| `bulleted_list_item`| `<ul><li>`                                         |
| `numbered_list_item`| `<ol><li>`                                         |
| `quote`             | `<blockquote>`                                     |
| `code`              | `<pre><code class="language-…">` + highlight       |
| `callout`           | `<div class="callout callout-{emoji}">`            |
| `image`             | `<Image>` (next/image), `loading="lazy"`           |
| `divider`           | `<hr>`                                             |
| `bookmark`          | `<a class="card-link">` rich preview               |
| `equation`          | KaTeX block                                        |
| `toggle`            | `<details><summary>`                               |

## Five-step setup

1. **Create an internal integration** in Notion
   `https://www.notion.so/profile/integrations` → **New integration** →
   give it read-only DB access. Copy the resulting secret
   (starts with `secret_…`).
2. **Duplicate the database template** into the workspace where the
   integration was created.
3. **Share the database** with the integration: open the DB → top-right
   `•••` → **Connections** → add the new integration.
4. **Get the database ID**: it's the 32-char hex segment in the DB URL
   (`https://www.notion.so/<workspace>/<DATABASE_ID>?v=…`).
5. **Add credentials** to `.env.local` (do **not** commit):
   ```env
   NOTION_TOKEN=secret_xxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Then run `npm run sync:notion` (script to be added — see below).

## Dependencies to add (when implementing)

```bash
npm install --save-dev @notionhq/client notion-to-md
```

Add to `package.json`:
```json
{
  "scripts": {
    "sync:notion": "node scripts/sync-notion.mjs",
    "prebuild": "npm run sync:notion"
  }
}
```

## Open questions to decide before implementing

- **Drafts:** keep the simple `Status=Published` filter, or build a
  preview route (`/writing/preview/[id]`) gated by a query token?
- **Rebuilds on edit:** Notion has webhooks (beta) — wire them into a
  Cloudflare Pages / Netlify rebuild hook, or stick with manual
  `git push` to re-trigger CI?
- **Image hosting:** Notion CDN URLs expire (~ 1 h signed). Either
  re-host to `public/writing/<slug>/` during sync, or proxy through a
  serverless function. Re-host is simpler for static export.
- **Backfill:** seed the database from current `lib/data.ts` posts so
  the existing `/writing` route keeps working until cutover.
- **Comments / reactions:** out of scope for v1; consider Giscus
  (GitHub Discussions) later.
