import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

test("concept autolinks skip code and existing anchors", async () => {
  const source = await readFile(new URL("../lib/linking.ts", import.meta.url), "utf8");
  const compiled = ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 });
  const compiledModule = { exports: {} };
  const fixtureConcepts = [{ id: "local-ai", aliases: ["Local AI", "offline"] }];
  new Function("require", "module", "exports", compiled)(() => ({ concepts: fixtureConcepts }), compiledModule, compiledModule.exports);
  const input = "Local AI; `Local AI`; [Local AI](https://example.com); <a href=\"/\">Local AI</a>; ```js\nLocal AI\n```.";
  const parts = compiledModule.exports.linkConcepts(input);
  assert.equal(parts.filter((part) => part.href).length, 1);
  assert.equal(parts.find((part) => part.href)?.text, "Local AI");
  assert.equal(parts.map((part) => part.text).join(""), input);
  assert.equal(compiledModule.exports.linkConcepts("Local AI and local AI and local AI").filter(part => part.href).length, 1);
  assert.equal(compiledModule.exports.linkConcepts("notLocal AI offlineish").filter(part => part.href).length, 0);
});
