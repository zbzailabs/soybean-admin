import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  reporter: [['list']],
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: 'http://127.0.0.1:3030',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 960 }
      }
    }
  ],
  webServer: {
    command: 'pnpm exec vite dev --host 127.0.0.1 --port 3030',
    url: 'http://127.0.0.1:3030/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      SOY_API_BASE_URL: 'http://127.0.0.1:3030/api/unavailable',
      SOY_API_MOCK_TOKEN: 'playwright',
      SOY_SERVICE_SUCCESS_CODE: '0000',
      SOY_SERVICE_LOGOUT_CODES: '8888,8889',
      SOY_SERVICE_EXPIRED_TOKEN_CODES: '9999,9998,3333',
      SOY_WEB_PUBLIC_URL: 'http://127.0.0.1:3030'
    }
  }
});
