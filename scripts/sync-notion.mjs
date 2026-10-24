import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { safeUrl, validateContent } from "../lib/content-schema.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const OUTPUT = resolve(ROOT, "content/notion-posts.json");
const API_VERSION = "2026-03-11";
const property = (page, name, type, optional = false) => {
  const value = page.properties?.[name];
  if (optional && !value) return undefined;
  if (!value || value.type !== type) throw new Error(`Notion schema requires ${name} (${type}).`);
  return value[type];
};
const text = (parts) => {
  if (!Array.isArray(parts)) throw new Error("Notion rich text is malformed.");
  return parts.map((part) => {
  if (typeof part.plain_text !== "string") throw new Error("Notion rich text is malformed.");
  const link = part.href ?? part.text?.link?.url ?? null;
  if (link && !safeUrl(link)) throw new Error("Only HTTP(S) links are supported in published content.");
  return { text: part.plain_text, ...(link ? { href: link } : {}), ...(part.annotations ? { marks: Object.fromEntries(Object.entries(part.annotations).filter(([, enabled]) => enabled === true)) } : {}) };
  });
};

export function isPublishable(page) {
  const status = property(page, "Status", "select");
  const language = property(page, "Language", "select");
  const reviewed = property(page, "Reviewed", "checkbox");
  return status?.name === "Published" && ["en", "ru"].includes(language?.name) && reviewed === true;
}

export function convertBlock(block) {
  const type = block.type;
  if (["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "quote", "callout"].includes(type)) {
    const content = text(block[type]?.rich_text);
    if (type === "callout") return { type, content, icon: block.callout?.icon?.type === "emoji" ? block.callout.icon.emoji : undefined };
    return { type, content };
  }
  if (type === "code") return { type, content: text(block.code?.rich_text), language: block.code?.language ?? "plain text" };
  if (type === "divider") return { type };
  if (type === "toggle") return { type, content: text(block.toggle?.rich_text), children: (block.children ?? []).map(convertBlock) };
  if (type === "image") {
    const url = block.image?.external?.url;
    if (block.image?.type !== "external" || !safeUrl(url)) throw new Error("Images need a permanent external HTTP(S) URL; expiring Notion file URLs cannot be published.");
    return { type, url, caption: text(block.image?.caption ?? []) };
  }
  if (type === "bookmark") {
    const url = block.bookmark?.url;
    if (!safeUrl(url)) throw new Error("Only HTTP(S) bookmarks are supported.");
    return { type, url, caption: text(block.bookmark?.caption ?? []) };
  }
  throw new Error(`Unsupported Notion block type: ${String(type)}.`);
}

export function convertPage(page, blocks) {
  if (!isPublishable(page)) return null;
  const titleParts = property(page, "Title", "title");
  const slugParts = property(page, "Slug", "rich_text");
  const date = property(page, "PublishedAt", "date")?.start;
  const title = text(titleParts).map(({ text }) => text).join("").trim();
  const slug = text(slugParts).map(({ text }) => text).join("").trim();
  if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !date || !/^\d{4}-\d\d-\d\d$/.test(date)) throw new Error(`Published Notion page ${page.id} has invalid title, slug, or date.`);
  const excerpt = text(property(page, "Excerpt", "rich_text", true) ?? []).map(({ text }) => text).join("");
  if (excerpt.length > 200) throw new Error(`Published Notion page ${slug} has an excerpt longer than 200 characters.`);
  const tags = (page.properties?.Tags?.multi_select ?? []).map((tag) => tag.name);
  const kind = property(page, "Type", "select", true)?.name ?? "note";
  const rating = property(page, "Rating", "number", true);
  return { id: page.id, slug, title, date, language: property(page, "Language", "select").name, excerpt, tags, kind, ...(rating !== undefined && rating !== null ? { rating } : {}), published: true, blocks: blocks.map(convertBlock) };
}

async function notionRequest(path, token, body, method) {
  const response = await fetch(`https://api.notion.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": API_VERSION, "Content-Type": "application/json" },
    ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Notion API request failed (${response.status}); no content was written.`);
  return response.json();
}

async function getAll(path, token, body, method = path.endsWith("/query") ? "POST" : "GET") {
  const results = [];
  let cursor;
  do {
    const requestPath = method === "GET" ? `${path}?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ""}` : path;
    const response = await notionRequest(requestPath, token, method === "POST" ? { ...body, page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) } : undefined, method);
    if (!Array.isArray(response.results)) throw new Error("Notion returned an invalid paginated response.");
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
    if (response.has_more && !cursor) throw new Error("Notion pagination omitted its cursor.");
  } while (cursor);
  return results;
}

export async function fetchPublished(dataSourceId, token) {
  const pages = await getAll(`data_sources/${encodeURIComponent(dataSourceId)}/query`, token, {
    filter: { and: [
      { property: "Status", select: { equals: "Published" } },
      { property: "Reviewed", checkbox: { equals: true } },
      { or: [{ property: "Language", select: { equals: "en" } }, { property: "Language", select: { equals: "ru" } }] },
    ] },
    sorts: [{ property: "PublishedAt", direction: "descending" }],
  });
  const published = [];
  for (const page of pages) {
    if (!isPublishable(page)) continue;
    const loadBlocks = async (id, depth = 0) => {
      if (depth > 12) throw new Error("Notion nesting exceeds the supported depth.");
      const blocks = await getAll(`blocks/${encodeURIComponent(id)}/children`, token, {});
      for (const block of blocks) if (block.has_children) {
        if (block.type !== "toggle") throw new Error(`Nested ${block.type} blocks are unsupported; use a toggle or flatten them.`);
        block.children = await loadBlocks(block.id, depth + 1);
      }
      return blocks;
    };
    const blocks = await loadBlocks(page.id);
    published.push(convertPage(page, blocks));
  }
  const slugs = new Set();
  for (const entry of published) {
    const key = `${entry.language}:${entry.slug}`;
    if (slugs.has(key)) throw new Error(`Duplicate published slug: ${entry.slug}.`);
    slugs.add(key);
  }
  return published;
}

export function mergeWithoutDeletion(existing, incoming) {
  const byId = new Map(existing.map((entry) => [entry.id, { ...entry, published: false }]));
  for (const entry of incoming) {
    const previous = byId.get(entry.id);
    if (previous && (previous.slug !== entry.slug || previous.language !== entry.language)) throw new Error("Published slugs and languages are immutable; create a new entry and a redirect instead.");
    byId.set(entry.id, { ...entry, published: true });
  }
  const merged = [...byId.values()];
  const slugs = new Set();
  for (const entry of merged) {
    const key = `${entry.language}:${entry.slug}`;
    if (slugs.has(key)) throw new Error(`Duplicate slug after merge: ${entry.slug}.`);
    slugs.add(key);
  }
  return merged;
}

async function applySnapshot(path) {
  try {
    await readFile(path);
    const snapshot = `${path}.${new Date().toISOString().replace(/[:.]/g, "-")}.bak`;
    await copyFile(path, snapshot, 1);
    return snapshot;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function sync({ token, dataSourceId, apply = false, output = OUTPUT }) {
  if (!token || !dataSourceId) throw new Error("Set NOTION_TOKEN and NOTION_DATA_SOURCE_ID before syncing.");
  const incoming = await fetchPublished(dataSourceId, token);
  let existing = [];
  try {
    existing = JSON.parse(await readFile(output, "utf8"));
    if (!Array.isArray(existing)) throw new Error("Existing content file must be a JSON array.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const merged = mergeWithoutDeletion(existing, incoming);
  validateContent(merged);
  const changed = JSON.stringify(existing) !== JSON.stringify(merged);
  if (!apply) return { fetched: incoming.length, total: merged.length, changed, applied: false };
  if (!changed) return { fetched: incoming.length, total: merged.length, changed: false, applied: false };
  await mkdir(dirname(output), { recursive: true });
  const backup = await applySnapshot(output);
  const temporary = `${output}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(merged, null, 2)}\n`, { flag: "wx" });
    await rename(temporary, output);
  } catch {
    try { await (await import("node:fs/promises")).unlink(temporary); } catch {}
    throw new Error(`Write failed; existing content was preserved${backup ? ` (snapshot: ${backup})` : ""}.`);
  }
  return { fetched: incoming.length, total: merged.length, changed: true, applied: true, backup };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const apply = process.argv.includes("--apply");
  try {
    const result = await sync({ token: process.env.NOTION_TOKEN, dataSourceId: process.env.NOTION_DATA_SOURCE_ID, apply });
    console.log(JSON.stringify(result));
    if (!apply && result.changed) console.log("Preview only. Re-run with --apply to snapshot and update local content.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
