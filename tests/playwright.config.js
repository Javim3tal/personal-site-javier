// @ts-check
// End-to-end tests for the site. Serves the repo root (one level up) as-is,
// exactly like GitHub Pages does, and runs the specs in tests/e2e.
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const PORT = Number(process.env.PORT) || 4173;
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } }
  ],

  // Set BASE_URL to test an already-running or deployed site instead (e.g. https://javierortizborrego.com).
  webServer: process.env.BASE_URL ? undefined : {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    cwd: path.resolve(__dirname, '..'),
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
