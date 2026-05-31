import { expect, test as base } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

type ConsoleFixtures = {
  consoleErrors: string[];
};

const test = base.extend<ConsoleFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];

    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await use(errors);
    expect(errors).toEqual([]);
  }
});

const sessionCookieName = 'soybean_session';

async function authenticate(context: BrowserContext) {
  const session = {
    accessToken: 'playwright-access-token',
    refreshToken: 'playwright-refresh-token',
    userInfo: {
      userId: 'super',
      userName: 'Super',
      roles: ['R_SUPER'],
      buttons: ['query', 'create', 'update', 'delete']
    },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  };

  await context.addCookies([
    {
      name: sessionCookieName,
      value: Buffer.from(JSON.stringify(session), 'utf8').toString('base64url'),
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Math.floor(Date.now() / 1000) + 24 * 60 * 60
    }
  ]);
}

test('health endpoint returns service status', async ({ request }) => {
  const response = await request.get('/api/health');

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    service: 'soybean-admin-web'
  });
});

test('unauthenticated users are redirected to login', async ({ page, consoleErrors }) => {
  void consoleErrors;

  await page.goto('/home');

  await expect(page).toHaveURL(/\/login\?redirect=/);
  await expect(page.getByRole('heading', { name: '登录' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Super' })).toBeVisible();
});

test('authenticated shell renders dynamic menus and management table', async ({ context, page, consoleErrors }) => {
  void consoleErrors;
  await authenticate(context);

  await page.goto('/manage/user');

  await expect(page.getByRole('heading', { name: '用户管理' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '张三' })).toBeVisible();

  await page.getByRole('button', { name: /角色管理/ }).click();
  await expect(page).toHaveURL(/\/manage\/role/);
  await expect(page.getByRole('heading', { name: '角色管理' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '超级管理员' })).toBeVisible();
});

test('data screen renders a nonblank Three.js canvas and reduced-motion toggle', async ({ context, page, consoleErrors }) => {
  void consoleErrors;
  await authenticate(context);

  await page.goto('/visualization/data-screen');

  await expect(page.getByRole('heading', { name: '三维数据大屏' })).toBeVisible();
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  const canvasBox = await canvas.boundingBox();
  expect(canvasBox?.width).toBeGreaterThan(600);
  expect(canvasBox?.height).toBeGreaterThan(400);
  const canvasScreenshot = await canvas.screenshot();
  expect(canvasScreenshot.byteLength).toBeGreaterThan(20_000);

  const reducedMotion = page.getByRole('button', { name: '减少动态' });
  await reducedMotion.click();
  await expect(reducedMotion).toHaveClass(/bg-primary/);
});
