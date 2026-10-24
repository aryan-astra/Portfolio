# Architecture and delivery notes

The English and Russian experiences use separate App Router root layouts. All public content is statically exported. English hydrates only interactive components; Russian export postprocessing removes client scripts and script preloads while retaining semantic HTML and JSON-LD. Theme storage is the only browser persistence. No external content is fetched during a page view.

Design conventions: warm paper/ink/blue, Fraunces headings, Inter body, JetBrains Mono labels. Native pointer events drive the bounded avatar; native dialog/details provide navigation and disclosures. The IST string clock and retained eye canvas stop work when invisible. Reduced motion removes decorative movement. The graph is isolated to its route with an ordinary link/list alternative. The footer artwork uses a progressive CSS scroll animation and static fallback. The folded note is a lightweight original paper reveal, not a port of the proprietary Framer effect. The owner’s GitHub avatar is used because no portrait photograph was available.

## Content and evidence

`lib/data.ts` remains the owner source, `lib/ru.ts` the explicitly unreviewed translation, and `content/notion-posts.json` the validated publishing snapshot. Empty notebook/library shelves have no invented reviews. Conservative aliases in `lib/concepts.ts` generate links, graph edges, and backlinks from the same text. Existing authored links and code are excluded. Search is a small local index. Writing and reviewed notes are exposed through RSS. Person metadata makes no invented biographical claims.

Arch SRM's stack was corrected against upstream commit `0676d4b271fc9692f3e9be4367525faa834d985e`: React/Vite/TypeScript with Express/Redis. Its image comes from the owner's sanitized upstream screenshot, optimized to WebP; the case study labels it sanitized. VOCO was checked against README commit `a948964fb42842a9f44d8e0e4431f4da4c59ba15`. Existing adoption metrics are owner-reported and were not independently measured. Other project descriptions were preserved.

References informed original interactions and composition: yashf.in, yashb.xyz, julius.works, focus.itshassco.com, jm.sv; the supplied Pluto meme informed the orbit experiment. No third-party site source or venom-button package was copied into the app. Large 3D packages and an unused component CLI were removed. Next.js was patched to 16.4.3; npm audit reports zero vulnerabilities at delivery.

## Privacy and reduced analytics

No visitor collector, IP store, fingerprint, third-party tracker, paid tier, or publicly exposed dashboard is deployed. Static export cannot safely receive events. A separately authenticated collector plus durable storage would require a confirmed free-tier backend and retention/access decisions. Those have not been configured; free unlimited persistence is not assumed.

The reduced owner solution is a local audit dashboard (`npm run audit:report`, then open `audits/report.html`) built from measured Lighthouse and archive reports. It contains engineering measurements only, with no visitor data and no website runtime cost. It cannot report page views, referrals, exits, country, or engagement. `/privacy` accurately describes this state. Retention is local until the owner deletes the ignored audit files.

## Validation and performance

Unit checks cover content trust boundaries, safe URLs, dates, pagination, nested block conversion, publication state, protected automatic links, and export processing. The build verifies 197 archive hashes and 56 current HTML pages, internal destinations/assets, language, metadata URL hygiene, and scriptless Russian output. Browser tests cover widths 320/390/768/1024/1440/1920, theme persistence, clock, mouse and keyboard avatar, fold, native menu dismissal, graph/search, article links, résumé, reduced motion, archive routes, locale isolation, and 404s. Screenshots were inspected. Automated accessibility does not replace a complete manual WCAG or screen-reader audit.

Local mobile Lighthouse improved from 78 to 83 after removing root Framer hydration and fixing static segment-prefetch errors: accessibility 100, best practices 100, SEO 100. That run measured LCP 3.1 s, TBT 400 ms, CLS 0, under simulated mobile throttling while another browser run overlapped. It misses the requested 90 performance and 2.5 s LCP goals. The final idle measurements are recorded below when available. Lab TBT is not field INP; no field Core Web Vitals claim is made.

Google PageSpeed's public baseline request could not resolve the current production domain. Actuity scan `76151b83-325d-4ed6-b6ec-8a342699fc26` failed with its own service error and explicitly said this was not a website result. Neither produced a valid score. Evidence is in ignored `audits/pagespeed-baseline.*` and `audits/actuity-baseline.*`. No success was inferred from those failures.

## Deployment and rollback

Correct Vercel project: `aryan`, `prj_OsgdIab71a5VYERqWTotrcsVCQ2n`, team `team_XIWi0VEJvuzJGu49WGJ12o2M`. The similarly named `portfolio` project is not the primary site. Production is `https://aryans.is-a.dev`, originally deployment `dpl_BwArwHWrYXze8SdARrdNNs4MRPZj` at original Git SHA `d417043187d1d660efade427b08399532a96b77c`. Redesign branch: `codex/editorial-portfolio`. Use Vercel previews without promoting or merging. Existing SSO protection stays enabled; external audit services cannot reliably inspect a protected preview. No paid service was activated.

Build: npm ci, npm run build; output: out; Node 24 locally. Security headers are in vercel.json; archive responses have noindex. Keep deployment protection in place. Releasing production requires a separate decision after preview review. Rollback: retain/redeploy the original deployment or the preserved archive tag; never reset or force-push main. See archive.md for exact frozen provenance.

## Remaining limits

Notion destination is undecided, real credentials/API publishing untested. Russian prose needs owner/native editorial review; no subdomain registration or DNS changes were made. Library entries require real editorial content. Visitor analytics persistence is not implemented. External audit services failed on baseline, protected preview testing is constrained, and field INP is unavailable. Archive pixel comparison covers the homepage viewport with animated eyes masked, not every frame/route.

Final idle local mobile audit (2026-10-24): performance **72**, accessibility **100**, best practices **100**, SEO **100**; LCP **3.3 s**, TBT **680 ms**, CLS **0**. The lower idle rerun shows lab variability and still misses the performance target. Do not average it away or report the earlier 83 as the final score. Core framework hydration remains the main long-task cost; a larger rendering change needs a separate measured pass. Browser flows passed 5/5; the opt-in baseline comparison is skipped by default and was run separately with a zero differing-pixel ratio. Unit checks passed 8/8, ESLint passed, export checks passed 56/56.
