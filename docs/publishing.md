# Publishing from Notion

The site works without a Notion connection. The owner has not selected a destination yet; no database was created and no real sync was performed. Existing writing remains in `lib/data.ts`. Reviewed Notion entries render under `/notes` and `/ru/notes`, with library types also indexed in `/library`, search, RSS, and related concepts.

Set `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in ignored `.env.local` using the intended integration. Do not commit credentials. Share only the intended data source with the integration. The CLI uses native fetch and pinned Notion API version 2026-03-11; builds read the committed snapshot and need no API credentials or network access to Notion.

Required properties: Title (title), Slug (rich text), PublishedAt (date with no time), Status (select), Language (select), Reviewed (checkbox). Only Status=Published, Language=en/ru, Reviewed=true entries publish. Optional properties: Excerpt (rich text, at most 200 characters), Tags (multi-select), Type (select: note, essay, research, concept, person, book, film, experiment), Rating (number, integer 0–4 for books/films).

```powershell
npm run content:sync
npm run content:sync -- --apply
npm run content:check
npm test
npm run build
npm run test:e2e
```

The first command previews changes. Apply validates all incoming data, snapshots existing JSON to a timestamped ignored `.bak`, and atomically replaces `content/notion-posts.json`. Entries absent from the query are retained with `published: false`, so unpublishing removes public routes without destroying source data. Review the diff before committing. Restore by copying a reviewed backup over the JSON. Published slugs and languages are immutable; moving them requires an explicit redirect plan.

Supported: rich text and marks, headings, paragraphs, contiguous ordered/bullet lists, quotes, emoji callouts, fenced code, dividers, HTTP(S) bookmarks, permanent external images, nested toggles (depth limit 12). Expiring Notion file URLs, unsafe URLs, malformed content, and unsupported blocks fail before writing. Nested content outside supported toggles fails explicitly. Pagination is followed for pages and blocks. Raw HTML is never injected. Code and authored links do not receive automatic concept links.

English and Russian entries are independently reviewed; neither language is automatically published as a translation. Empty shelves are intentional. Fixture tests cover validation, pagination, conversion, immutable slugs, and unpublishing. Real API authorization and actual editorial content remain unverified until a destination is chosen.
