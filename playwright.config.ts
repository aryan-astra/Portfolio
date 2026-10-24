import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 30000,
  reporter: [["list"], ["html", { outputFolder: "audits/playwright", open: "never" }]],
  outputDir: "audits/test-results",
  use: { baseURL: "http://127.0.0.1:4173", channel: "chrome", headless: true, viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
  webServer: { command: "npm run preview", url: "http://127.0.0.1:4173", reuseExistingServer: true, timeout: 60000 },
});
