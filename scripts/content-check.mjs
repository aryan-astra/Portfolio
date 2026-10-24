import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateContent } from "../lib/content-schema.mjs";
export { validateContent } from "../lib/content-schema.mjs";

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const path = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL("../content/notion-posts.json", import.meta.url));
  try { console.log(`Validated ${validateContent(JSON.parse(await readFile(path, "utf8")))} content entries.`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
