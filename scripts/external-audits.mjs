import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("audits", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const speed = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await speed.goto("https://pagespeed.web.dev/analysis?url=https%3A%2F%2Faryans.is-a.dev%2F&form_factor=mobile", { waitUntil: "domcontentloaded", timeout: 60000 });
  try { await speed.getByText("Performance", { exact: true }).first().waitFor({ timeout: 90000 }); } catch {}
  await writeFile("audits/pagespeed-baseline.txt", `URL: ${speed.url()}\n${await speed.locator("body").innerText()}`);
  await speed.screenshot({ path: "audits/pagespeed-baseline.png", fullPage: true });
  console.log(`PageSpeed baseline: ${speed.url()}`);
  const actuity = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await actuity.goto("https://actuity.tech/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const form = actuity.getByRole("region", { name: /Your next customer/i });
  await form.getByPlaceholder(/public site URL/i).fill("https://aryans.is-a.dev/");
  await form.getByRole("button", { name: /Scan my site/i }).click();
  try { await actuity.waitForURL(url => url.pathname !== "/", { timeout: 30000 }); } catch {}
  try { await actuity.getByText(/scan complete|scan failed|readiness score|could not|error|rate limit/i).first().waitFor({ timeout: 60000 }); } catch {}
  await writeFile("audits/actuity-baseline.txt", `URL: ${actuity.url()}\n${await actuity.locator("body").innerText()}`);
  await actuity.screenshot({ path: "audits/actuity-baseline.png", fullPage: true });
  console.log(`Actuity baseline: ${actuity.url()}`);
} finally { await browser.close(); }
