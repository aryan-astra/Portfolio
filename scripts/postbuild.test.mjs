import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { finalizeExport, segmentAlias, stripClientRuntime } from "./postbuild.mjs";

test("static segment aliases match browser requests without touching assets", () => {
  assert.equal(segmentAlias("search/__next.!KGVuKQ/search/__PAGE__.txt"), "search/__next.!KGVuKQ.search.__PAGE__.txt");
  assert.equal(segmentAlias("og/projects/a/__next.projects/$d$slug/__PAGE__.txt"), "og/projects/a/__next.projects.$d$slug.__PAGE__.txt");
  assert.equal(segmentAlias("_next/static/main.js"), null);
});

test("Russian HTML keeps semantic content and metadata without hydration scripts", async () => {
  const html = '<html lang="ru"><head><link rel="preload" as="script" href="app.js"><link rel="stylesheet" href="a.css"><script type="application/ld+json">{"name":"Test"}</script></head><body><main><a href="/ru/writing">Тексты</a><code>&lt;script&gt;example&lt;/script&gt;</code></main><script src="app.js"></script><script>self.__next_f=[]</script></body></html>';
  const root = await mkdtemp(join(tmpdir(), "portfolio-export-"));
  await mkdir(join(root, "search/__next.!KGVuKQ/search"), { recursive: true });
  await writeFile(join(root, "search/__next.!KGVuKQ/search/__PAGE__.txt"), "rsc-data");
  await writeFile(join(root, "ru.html"), html);
  await finalizeExport(root);
  const result = await readFile(join(root, "ru.html"), "utf8");
  assert.equal(result, stripClientRuntime(html));
  assert.ok(result.includes('type="application/ld+json"'));
  assert.ok(result.includes("&lt;script&gt;example&lt;/script&gt;"));
  assert.ok(!result.includes('src="app.js"'));
  assert.equal(await readFile(join(root, "search/__next.!KGVuKQ.search.__PAGE__.txt"), "utf8"), "rsc-data");
});
