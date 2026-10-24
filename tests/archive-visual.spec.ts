import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

test("archive pixels match the original production homepage", async ({ page }) => {
  test.skip(process.env.COMPARE_ARCHIVE !== "1", "Explicit live baseline comparison only");
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const screenshots: Buffer[] = [];
  for (const [name, url] of [["original", "https://aryans.is-a.dev/"], ["frozen", "http://127.0.0.1:4173/og/"]]) {
    await page.goto(url, { waitUntil: "networkidle" });
    await expect.poll(() => page.locator("h1").evaluate(element => getComputedStyle(element).opacity)).toBe("1");
    await page.evaluate(() => document.fonts.ready);
    screenshots.push(await page.screenshot({ path: `audits/${name}-comparison.png`, mask: [page.locator("canvas")], animations: "disabled" }));
  }
  const [left, right] = await Promise.all(screenshots.map(image => sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  expect(left.info).toEqual(right.info);
  let differing = 0;
  for (let offset = 0; offset < left.data.length; offset += 4) {
    if ([0, 1, 2].some(channel => Math.abs(left.data[offset + channel] - right.data[offset + channel]) > 8)) differing++;
  }
  const ratio = differing / (left.info.width * left.info.height);
  await writeFile("audits/archive-comparison.json", JSON.stringify({ source: "d417043187d1d660efade427b08399532a96b77c", width: left.info.width, height: left.info.height, differingPixelRatio: ratio, tolerance: 8, masked: "animated eye canvases" }, null, 2));
  expect(ratio).toBeLessThan(0.01);
});
