import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";

const root = resolve("out");
let pages = 0;
async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const name = relative(root, path).replaceAll("\\", "/");
    if (name === "og" || name === "_next") continue;
    if (entry.isDirectory()) { await check(path); continue; }
    if (!name.endsWith(".html")) continue;
    const html = await readFile(path, "utf8");
    assert(!/https?:\/\/(?:localhost|127\.0\.0\.1)/.test(html), `${name}: local URL leaked`);
    assert(!name.includes("__unpublished"), "Unpublished placeholder escaped");
    assert(/<title>.+?<\/title>/.test(html), `${name}: missing title`);
    const russian = name === "ru.html" || name.startsWith("ru/");
    assert(html.includes(`lang="${russian ? "ru" : "en"}"`), `${name}: wrong language`);
    if (russian) assert(!/<script(?![^>]*application\/ld\+json)/i.test(html), `${name}: unexpected runtime`);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
      const target = resolve(root, decodeURIComponent(match[1]).slice(1));
      assert([target, `${target}.html`, resolve(target, "index.html")].some(existsSync), `${name}: missing ${match[1]}`);
    }
    pages++;
  }
}
await check(root);
assert((await readFile(resolve(root, "feed.xml"), "utf8")).includes("<rss"), "Missing RSS feed");
console.log(`Verified ${pages} pages: languages, assets, internal routes, metadata URLs, and Russian static output.`);
