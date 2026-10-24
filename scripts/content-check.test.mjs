import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { convertBlock, convertPage, fetchPublished, isPublishable, mergeWithoutDeletion } from "./sync-notion.mjs";
import { validateContent } from "./content-check.mjs";

const page = JSON.parse(await readFile(new URL("./fixtures/notion-page.json", import.meta.url), "utf8"));

test("only reviewed English or Russian published pages qualify", () => {
  assert.equal(isPublishable(page), true);
  const draft = structuredClone(page);
  draft.properties.Status.select.name = "Draft";
  assert.equal(isPublishable(draft), false);
  const unreviewed = structuredClone(page);
  unreviewed.properties.Reviewed.checkbox = false;
  assert.equal(isPublishable(unreviewed), false);
});

test("saved content rejects malformed text, credentials in URLs, and invalid dates", () => {
  const valid = convertPage(page, [{ type: "paragraph", paragraph: { rich_text: [{ plain_text: "body" }] } }]);
  assert.throws(() => validateContent([{ ...valid, date: "2026-02-30" }]), /Invalid date/);
  assert.throws(() => validateContent([{ ...valid, blocks: [{ type: "paragraph", content: [{ text: "link", href: "https://user:password@example.com" }] }] }]), /unsafe link/);
  assert.throws(() => validateContent([{ ...valid, blocks: [{ type: "paragraph", content: [{ text: {} }] }] }]), /Malformed rich text/);
});

test("Notion block pagination uses GET cursor and validates nested toggles", async () => {
  const originalFetch = globalThis.fetch;
  const paths = [];
  globalThis.fetch = async (url) => {
    paths.push(String(url));
    const path = new URL(url);
    let result;
    if (path.pathname.includes("data_sources")) result = { results: [page], has_more: false };
    else if (!path.searchParams.has("start_cursor")) result = { results: [{ type: "paragraph", paragraph: { rich_text: [{ plain_text: "First" }] } }], has_more: true, next_cursor: "next-page" };
    else result = { results: [{ type: "paragraph", paragraph: { rich_text: [{ plain_text: "Second" }] } }], has_more: false };
    return new Response(JSON.stringify(result), { status: 200 });
  };
  try {
    const entries = await fetchPublished("test-source", "fixture-token");
    assert.equal(entries[0].blocks.length, 2);
    assert.ok(paths.some(path => path.includes("start_cursor=next-page")));
    assert.equal(validateContent(entries), 1);
  } finally { globalThis.fetch = originalFetch; }
});

test("converts approved text blocks and rejects unsafe links or unknown blocks", () => {
  assert.deepEqual(convertBlock({ type: "paragraph", paragraph: { rich_text: [{ plain_text: "safe", href: "https://example.com", annotations: { bold: true } }] } }), {
    type: "paragraph", content: [{ text: "safe", href: "https://example.com", marks: { bold: true } }],
  });
  assert.throws(() => convertBlock({ type: "paragraph", paragraph: { rich_text: [{ plain_text: "unsafe", href: "javascript:alert(1)" }] } }), /HTTP\(S\)/);
  assert.throws(() => convertBlock({ type: "image" }), /permanent external/);
});

test("validates a page and merges fetched updates without deleting old pages", () => {
  const old = { id: "old", slug: "old-note", language: "ru", title: "Old", date: "2026-10-23", excerpt: "", tags: [], blocks: [] };
  const next = convertPage(page, [{ type: "paragraph", paragraph: { rich_text: [{ plain_text: "body" }] } }]);
  const merged = mergeWithoutDeletion([old], [next]);
  assert.deepEqual(merged.map(({ id }) => id), ["old", page.id]);
  assert.equal(validateContent(merged), 2);
  assert.equal(merged[0].published, false);
  assert.throws(() => mergeWithoutDeletion([next], [{ ...next, slug: "renamed" }]), /immutable/);
  assert.throws(() => validateContent([{ ...next, slug: "../bad" }]), /stable slug/);
});
