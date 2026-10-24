import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const escape = value => String(value).replace(/[<>&"]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[char]);
const sections = [];
for (const name of ["lighthouse-mobile-final", "lighthouse-mobile-idle", "lighthouse-desktop", "lighthouse-russian"]) {
  let report;
  try { report = JSON.parse(await readFile(`audits/${name}.json`, "utf8")); }
  catch (error) { if (error.code === "ENOENT") continue; throw error; }
  const scores = Object.values(report.categories).map(category => {
    assert(Number.isFinite(category.score) && category.score >= 0 && category.score <= 1, "Invalid measured score");
    return `<p>${escape(category.title)} <meter min="0" max="100" value="${Math.round(category.score * 100)}"></meter> ${Math.round(category.score * 100)}</p>`;
  }).join("");
  const metrics = ["largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"].map(id => `<li>${escape(report.audits[id].title)}: ${escape(report.audits[id].displayValue)}</li>`).join("");
  sections.push(`<section><h2>${escape(name)}</h2><p>${escape(report.finalDisplayedUrl ?? report.finalUrl)} · ${escape(report.fetchTime)}</p>${scores}<ul>${metrics}</ul></section>`);
}
assert(sections.length, "Run a Lighthouse audit into audits/ before generating the dashboard.");
await mkdir("audits", { recursive: true });
await writeFile("audits/report.html", `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Private local engineering audits</title><style>body{max-width:58rem;margin:3rem auto;padding:1rem;background:#f5f3ed;color:#111;font:18px/1.6 system-ui}section{border-top:1px solid #aaa;margin-top:2rem}meter{width:12rem;margin:0 1rem}</style><h1>Local engineering audits</h1><p>Measured lab results. No visitor data is collected. This file stays outside the public export. Lab TBT is not field INP.</p>${sections.join("")}<p>Public PageSpeed could not resolve the baseline URL; Actuity returned a service error. Neither produced a valid score.</p></html>`);
console.log("Wrote private local dashboard: audits/report.html");
