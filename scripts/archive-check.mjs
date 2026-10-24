import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, sep } from "node:path";

const root = resolve("public/og");
const manifest = JSON.parse(await readFile(resolve("docs/archive-manifest.json"), "utf8"));
const files = [];
async function walk(path) {
  for (const item of await readdir(path, { withFileTypes: true })) {
    const full = resolve(path, item.name);
    if (item.isDirectory()) await walk(full);
    else files.push(full);
  }
}
await walk(root);
assert.equal(files.length, Object.keys(manifest.files).length, "Archive file count changed");
for (const file of files) {
  const key = relative(root, file).split(sep).join("/");
  const content = await readFile(file);
  assert.equal(createHash("sha256").update(content).digest("hex"), manifest.files[key], `Frozen file changed: ${key}`);
  if (file.endsWith(".html")) {
    const html = content.toString();
    assert.match(html, /name="robots" content="[^"]*noindex/, `Missing noindex: ${key}`);
    assert.doesNotMatch(html, /(?:src|href)="\/(?:_next|resume\/Aryan-Shukla)/, `Asset escapes /og: ${key}`);
  }
}
console.log(`Verified ${files.length} frozen archive files from ${manifest.sourceCommit}.`);
