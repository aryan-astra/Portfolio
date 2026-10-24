import { copyFile, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export function segmentAlias(path) {
  const parts = path.split("/");
  const start = parts.findIndex(part => part.startsWith("__next."));
  return path.endsWith(".txt") && start >= 0 && start < parts.length - 1
    ? [...parts.slice(0, start), parts.slice(start).join(".")].join("/") : null;
}

export function stripClientRuntime(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, tag => /type="application\/ld\+json"/i.test(tag) ? tag : "")
    .replace(/<link\b[^>]*>/gi, tag => /rel="modulepreload"|as="script"/i.test(tag) ? "" : tag);
}

async function filesIn(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = resolve(path, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(file));
    else files.push(file);
  }
  return files;
}

export async function finalizeExport(output = resolve("out")) {
  for (const route of ["notes/__unpublished", "ru/notes/__unpublished"]) {
    for (const suffix of [".html", ".txt", ""]) {
      const file = resolve(output, `${route}${suffix}`);
      if (!file.startsWith(`${output}${sep}`)) throw new Error("Generated route escaped the export directory.");
      await rm(file, { recursive: true, force: true });
    }
  }
  for (const file of await filesIn(output)) {
    const path = relative(output, file).split(sep).join("/");
    // Static hosts need flat aliases for Next's segment-prefetch request filenames.
    const alias = segmentAlias(path);
    if (alias) await copyFile(file, resolve(output, alias));
    if ((path === "ru.html" || path.startsWith("ru/")) && path.endsWith(".html")) {
      await writeFile(file, stripClientRuntime(await readFile(file, "utf8")));
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await finalizeExport();
