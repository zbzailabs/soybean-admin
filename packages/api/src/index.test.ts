import { describe, expect, it } from 'vitest';
import { createLocalUser, createSession, getUserRoutesApi } from './index';

describe('api helpers', () => {
  it('creates deterministic local users for fallback sessions', () => {
    expect(createLocalUser('Super').roles).toEqual(['R_SUPER']);
    expect(createLocalUser('User').buttons).toEqual(['query']);
  });

  it('creates expiring auth sessions', () => {
    const session = createSession(
      { token: 'access', refreshToken: 'refresh' },
      { userId: 'super', userName: 'Super', roles: ['R_SUPER'], buttons: [] },
      1
    );

    expect(session.accessToken).toBe('access');
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it('falls back to local user routes when the remote route request fails', async () => {
    const routes = await getUserRoutesApi({
      fetcher: async () =>
        new Response(JSON.stringify({ data: null, code: '3333', msg: '用户已失效或不存在' }), { status: 200 })
    });

    expect(routes.home).toBe('home');
    expect(routes.routes.some(route => route.name === 'visualization')).toBe(true);
  });
});
