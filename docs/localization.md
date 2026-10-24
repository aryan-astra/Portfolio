# Russian edition

The Russian pages live under `/ru/`. They are static server-rendered routes and use the English project and post slugs as their stable keys. `lib/data.ts` remains the factual source for links, dates, statuses, tags, and technology names; `lib/ru.ts` supplies Russian prose keyed by those slugs. Keep both maps complete when adding a public project or post.

## Translation status

The current Russian copy was drafted with Codex from the English source. The site labels it as awaiting the owner's editorial review. It has not been reviewed by a native Russian editor, so do not describe it as verified or publish a claim that it has been independently checked.

When editing translations:

1. Compare the entire source item, including every case-study field and every post paragraph.
2. Preserve claims, dates, metrics, project state, and technical names. Do not fill gaps with plausible details or testimonials.
3. Keep slugs and outbound URLs from the English source. Add a matching translation-map key for every new slug.
4. After editorial review, update the notice in `lib/ru.ts` and this file to name the actual review status; retain the original facts as the authority.

## Routes and language metadata

- `/ru/` — homepage, contact details, featured projects, writing, and hackathons.
- `/ru/projects` and `/ru/projects/[slug]` — all public project descriptions and case studies.
- `/ru/writing` and `/ru/writing/[slug]` — complete translated post bodies.
- `/ru/resume` — translated resume content.

Each content route declares a canonical URL and English/Russian alternate links. The Russian route has its own root layout with `<html lang="ru">`; the English locale can keep its own root layout and document language.

## `rus.aryans.is-a.dev` registration

The is-a.dev project currently documents registration as a user fork, a domain JSON record, and a pull request with a website preview; the maintainer must merge the request before DNS is published. Its guide also requires a substantially complete personal/developer website. The read-only check of `is-a-dev/register` did not find `domains/rus.aryans.json` on the repository's `main` branch, but that alone does not prove availability. No fork, registration record, DNS change, or external pull request was made. The current edition uses the existing `aryans.is-a.dev/ru` path until the owner completes and confirms any subdomain registration.

Official references: [is-a.dev quickstart](https://docs.is-a.dev/quickstart/) and [is-a.dev registration repository](https://github.com/is-a-dev/register).

The Russian edition also includes `/ru/garden`, `/ru/garden/[slug]`, `/ru/notes`, `/ru/notes/[slug]`, `/ru/library`, `/ru/library/[shelf]`, and `/ru/privacy`. The build removes hydration/preload scripts from exported Russian HTML while preserving semantic content, CSS, and JSON-LD. Locale transitions are full document navigation. There is no Russian graph canvas or search app; the text index provides ordinary links to all translated concepts and sources.
