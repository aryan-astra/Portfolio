# Frozen original site

Source commit: `d417043187d1d660efade427b08399532a96b77c` (the production Git SHA independently confirmed in Vercel). Local preservation tag: `archive/pre-redesign-20261023`. The redesign lives on `codex/editorial-portfolio`.

`public/og` is a separate, compiled static export of that source, not an iframe or a reconstruction. It retains its own HTML, CSS, fonts, JavaScript, résumé files, and nested pages. It is copied into the final export under `/og` and never imported by the English or Russian app. It comprises 197 files, approximately 4 MB. `.gitattributes` prevents line-ending conversion of frozen files.

The isolated source build used the original locked Next.js 16.2.4 implementation, webpack, `basePath: /og`, and `assetPrefix: /og`. Only mount-related paths, canonical URLs, and noindex metadata were adapted. Résumé asset paths also point inside `/og`, including the client bundle's download paths. The new site uses the patched Next.js version independently. Archived runtime code is intentionally frozen; no Next server or API from that old build is deployed.

`docs/archive-manifest.json` records SHA-256 checksums for every frozen file. `npm run archive:check` verifies the manifest, noindex metadata, and isolated asset paths. It runs before every new build. Static segment-response filename aliases are created only in the final `out` directory for static-host compatibility; frozen source files stay unchanged.

An automated comparison against the live original at 1440×1000 produced a differing-pixel ratio of **0**, using an 8-level RGB tolerance and masking the animated eye canvases. This verifies the homepage viewport, not every route or every animation frame. Browser checks also exercised the archived homepage, project, writing, and résumé routes. Re-run the explicit comparison while production still serves the original:

```powershell
$env:COMPARE_ARCHIVE = '1'
npm run test:e2e -- --grep 'archive pixels'
```

Regeneration is deliberately separate from normal builds. `scripts/build-og-archive.ps1` refuses to overwrite an existing archive. To regenerate intentionally, first make a recoverable copy and move the frozen directory aside, then run the script. It extracts the exact original Git SHA into `audits/baseline`, installs that revision's locked dependencies without install scripts, and builds in isolation. Review any difference before updating the checksum manifest.

Rollback does not require rewriting history: retain the production deployment, or redeploy the preserved original SHA from its archive tag. Do not reset or force-push `main`.
