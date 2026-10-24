import { test, expect } from "@playwright/test";

test("homepage is readable across phone, tablet, laptop, and wide layouts", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Always building");
  await expect(page.getByRole("link", { name: /Arch SRM/ }).first()).toBeVisible();
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "audits/desktop-top.png", animations: "disabled" });
  await page.screenshot({ path: "audits/desktop.png", fullPage: true, animations: "disabled" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "audits/mobile-top.png", animations: "disabled" });
  await page.screenshot({ path: "audits/mobile.png", fullPage: true, animations: "disabled" });
  expect(errors).toEqual([]);
});

test("theme, clock, portrait, paper, and keyboard navigation work", async ({ page }) => {
  await page.goto("/");
  const clock = page.locator("time.clock-digits");
  await expect(clock).toHaveAttribute("aria-label", /\d\d:\d\d:\d\d, India Standard Time/);
  const previousTime = await clock.getAttribute("aria-label");
  await expect.poll(() => clock.getAttribute("aria-label")).not.toBe(previousTime);
  await page.getByRole("button", { name: "Toggle light or dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: "audits/dark.png", animations: "disabled" });
  const avatar = page.getByRole("button", { name: "Move Aryan's avatar" });
  const box = (await avatar.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 30, { steps: 12 });
  expect((await avatar.boundingBox())!.x).toBeGreaterThan(box.x + 30);
  await page.mouse.up();
  await expect.poll(async () => Math.abs((await avatar.boundingBox())!.x - box.x)).toBeLessThan(2);
  await avatar.focus();
  await avatar.press("ArrowRight");
  await expect.poll(async () => (await avatar.boundingBox())!.x).toBeGreaterThan(box.x + 8);
  await avatar.press("Escape");
  await page.locator(".paper-note button").click();
  await expect(page.locator("#paper-message")).toBeVisible();
  await page.locator(".paper-note button").click();
  await expect(page.locator("#paper-message")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.locator("body").evaluate(body => body.style.overflow)).toBe("");
});

test("search, graph sources, and reading links lead to real content", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("searchbox").fill("local AI");
  await expect(page.getByRole("link", { name: /Why I like local AI/ })).toBeVisible();
  await page.getByRole("searchbox").fill("nothing-matches-this-query");
  await expect(page.getByText("No matching items.", { exact: false })).toBeVisible();
  await page.goto("/garden");
  await page.getByRole("button", { name: "Local AI", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Local AI", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.getByRole("link", { name: "Open source" }).click();
  await expect(page).toHaveURL(/garden\/local-ai/);
  await page.goto("/writing/why-i-like-local-ai");
  await expect(page.locator("article a[href='/garden/local-ai']").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Connected ideas" })).toBeVisible();
});

test("Russian edition and archived pages stay independent", async ({ page, request }) => {
  await page.goto("/ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator(".site-header")).toHaveCount(0);
  await expect(page.locator(".ru-notice")).toBeVisible();
  await expect(page.locator("script[src]")).toHaveCount(0);
  await page.screenshot({ path: "audits/russian.png", fullPage: true });
  for (const path of ["/ru/projects/arch-srm", "/ru/writing/why-i-like-local-ai", "/ru/resume", "/og/", "/og/projects/arch-srm", "/og/writing/why-i-like-local-ai", "/og/resume"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text()).toContain("<html");
  }
  await page.goto("/og/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Aryan");
  await expect(page.locator(".site-header")).toHaveCount(0);
  await page.screenshot({ path: "audits/archive.png", animations: "disabled" });
  for (const path of ["/notes/__unpublished", "/a-route-that-does-not-exist"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("A little too far out");
  }
});

test("reduced motion keeps the résumé readable and downloadable", async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("time.clock-digits")).toHaveAttribute("aria-label", /\d\d:\d\d:\d\d, India Standard Time/);
  await expect.poll(() => page.locator(".clock-bead").first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await page.goto("/resume");
  await expect(page.getByRole("heading", { level: 1, name: "Aryan Shukla" })).toBeVisible();
  await page.getByRole("button", { name: "Skip animation" }).click();
  const pdf = page.getByRole("link", { name: "Download PDF", exact: true });
  expect((await request.get((await pdf.getAttribute("href"))!)).status()).toBe(200);
  await expect(page.getByRole("button", { name: "Print résumé" })).toBeVisible();
});
