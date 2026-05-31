import { createLocalUser, createSession, getConstantRoutesApi, getUserInfoApi, getUserRoutesApi, loginApi } from '@sa/api';
import type { AuthSession } from '@sa/domain';
import { constantRoutes, fallbackAuthRoutes, filterRoutesByRoles, withComponentKeys } from '@sa/domain';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';

const SESSION_COOKIE = 'soybean_session';
const ONE_DAY = 60 * 60 * 24;

function getEnv() {
  return {
    baseUrl: process.env.SOY_API_BASE_URL,
    mockToken: process.env.SOY_API_MOCK_TOKEN
  };
}

function encodeSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

function decodeSession(value: string | undefined): AuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as AuthSession;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | null | undefined) {
  return Object.fromEntries(
    (cookieHeader ?? '')
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [key, ...rest] = part.split('=');
        return [key, decodeURIComponent(rest.join('='))];
      })
  );
}

function sessionCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function readSessionFromRequest() {
  const cookies = parseCookies(getRequestHeader('cookie'));
  return decodeSession(cookies[SESSION_COOKIE]);
}

export const getSessionServer = createServerFn({ method: 'GET' }).handler(() => {
  return readSessionFromRequest();
});

export const loginServer = createServerFn({ method: 'POST' })
  .inputValidator((payload: { userName: string; password: string }) => payload)
  .handler(async ({ data }) => {
    const loginToken = await loginApi(data.userName, data.password, getEnv());
    let userInfo = createLocalUser(data.userName);

    try {
      userInfo = await getUserInfoApi({ ...getEnv(), accessToken: loginToken.token });
    } catch {
      userInfo = createLocalUser(data.userName);
    }

    const session = createSession(loginToken, userInfo, ONE_DAY);
    setResponseHeader('Set-Cookie', sessionCookie(encodeSession(session), ONE_DAY));
    return session;
  });

export const logoutServer = createServerFn({ method: 'POST' }).handler(() => {
  setResponseHeader('Set-Cookie', sessionCookie('', 0));
  return { ok: true };
});

export const getRoutesServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = readSessionFromRequest();
  const accessToken = session?.accessToken;

  const [remoteConstantRoutes, remoteUserRoutes] = await Promise.all([
    getConstantRoutesApi({ ...getEnv(), accessToken }),
    getUserRoutesApi({ ...getEnv(), accessToken })
  ]);

  const roles = session?.userInfo.roles ?? ['R_SUPER'];
  const authRoutes = filterRoutesByRoles(remoteUserRoutes.routes.length ? remoteUserRoutes.routes : fallbackAuthRoutes, roles);

  return {
    constantRoutes: withComponentKeys(remoteConstantRoutes.length ? remoteConstantRoutes : constantRoutes),
    authRoutes: withComponentKeys(authRoutes),
    home: remoteUserRoutes.home || 'home'
  };
});
