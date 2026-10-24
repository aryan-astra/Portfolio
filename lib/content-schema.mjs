export function safeUrl(value) {
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}

function validateParts(parts) {
  if (!Array.isArray(parts) || parts.some(part => !part || typeof part.text !== "string" || (part.href !== undefined && !safeUrl(part.href)) || (part.marks !== undefined && (typeof part.marks !== "object" || part.marks === null || Object.values(part.marks).some(mark => typeof mark !== "boolean"))))) throw new Error("Malformed rich text or unsafe link.");
}

function validateBlocks(blocks) {
  if (!Array.isArray(blocks)) throw new Error("Blocks must be an array.");
  for (const block of blocks) {
    if (!block || !["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "quote", "callout", "code", "divider", "bookmark", "image", "toggle"].includes(block.type)) throw new Error("Unsupported saved block.");
    if (!["divider", "bookmark", "image"].includes(block.type)) validateParts(block.content);
    if (["bookmark", "image"].includes(block.type) && !safeUrl(block.url)) throw new Error("Unsafe asset or bookmark URL.");
    if (block.caption !== undefined) validateParts(block.caption);
    if (block.children !== undefined) validateBlocks(block.children);
  }
}

export function validateContent(entries) {
  if (!Array.isArray(entries)) throw new Error("Content must be a JSON array.");
  const ids = new Set();
  const slugs = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry.id !== "string" || !entry.id || typeof entry.title !== "string" || !entry.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || !["en", "ru"].includes(entry.language) || !Array.isArray(entry.blocks)) throw new Error("Each entry needs an id, title, stable slug, language, and blocks.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || Number.isNaN(Date.parse(entry.date)) || new Date(entry.date).toISOString().slice(0,10) !== entry.date || typeof entry.excerpt !== "string" || !Array.isArray(entry.tags) || entry.tags.some(tag => typeof tag !== "string")) throw new Error(`Invalid date, excerpt, or tags in ${entry.slug}.`);
    const route = `${entry.language}:${entry.slug}`;
    if (entry.kind !== undefined && !["note", "essay", "research", "concept", "person", "book", "film", "experiment"].includes(entry.kind)) throw new Error("Unknown content type.");
    if (entry.rating !== undefined && (!Number.isInteger(entry.rating) || entry.rating < 0 || entry.rating > 4 || !["book", "film"].includes(entry.kind))) throw new Error("Book and film ratings must be integers from 0 to 4.");
    if (ids.has(entry.id) || slugs.has(route)) throw new Error(`Duplicate content id or slug: ${entry.slug}.`);
    ids.add(entry.id); slugs.add(route);
    validateBlocks(entry.blocks);
  }
  return entries.length;
}

