const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  workers: 1,
  reporter: [['line']],
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    port: 4173,
    reuseExistingServer: false,
    timeout: 30_000
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
