import type { AuthSession, SoyRoute, UserInfo } from '@sa/domain';
import { constantRoutes, fallbackAuthRoutes } from '@sa/domain';

export interface ApiEnvelope<T> {
  data: T | null;
  code: string;
  msg: string;
}

export interface LoginToken {
  token: string;
  refreshToken: string;
}

export interface UserRouteResponse {
  routes: SoyRoute[];
  home: string;
}

export interface ApiClientOptions {
  baseUrl?: string;
  mockToken?: string;
  accessToken?: string;
  fetcher?: typeof fetch;
}

export const DEFAULT_API_BASE_URL = 'https://mock.apifox.cn/m1/3109515-0-default';
export const DEFAULT_MOCK_TOKEN = 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2';
export const SERVICE_SUCCESS_CODE = '0000';

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  const json = (await response.json()) as ApiEnvelope<T> | { apifoxError?: { code: number; message: string } };

  if ('apifoxError' in json && json.apifoxError) {
    throw new ApiError(json.apifoxError.message, String(json.apifoxError.code), response.status);
  }

  return json as ApiEnvelope<T>;
}

export async function requestApifox<T>(path: string, init: RequestInit = {}, options: ApiClientOptions = {}) {
  const fetcher = options.fetcher ?? fetch;
  const headers = new Headers(init.headers);
  headers.set('apifoxToken', options.mockToken ?? DEFAULT_MOCK_TOKEN);

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetcher(joinUrl(options.baseUrl ?? DEFAULT_API_BASE_URL, path), {
    ...init,
    headers
  });
  const envelope = await parseEnvelope<T>(response);

  if (envelope.code !== SERVICE_SUCCESS_CODE || envelope.data === null) {
    throw new ApiError(envelope.msg, envelope.code, response.status);
  }

  return envelope.data;
}

export async function loginApi(userName: string, password: string, options: ApiClientOptions = {}) {
  return requestApifox<LoginToken>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ userName, password })
    },
    options
  );
}

export async function getUserInfoApi(options: ApiClientOptions = {}) {
  return requestApifox<UserInfo>('/auth/getUserInfo', undefined, options);
}

export async function getConstantRoutesApi(options: ApiClientOptions = {}) {
  try {
    return await requestApifox<SoyRoute[]>('/route/getConstantRoutes', undefined, options);
  } catch {
    return constantRoutes;
  }
}

export async function getUserRoutesApi(options: ApiClientOptions = {}) {
  try {
    return await requestApifox<UserRouteResponse>('/route/getUserRoutes', undefined, options);
  } catch {
    return { routes: fallbackAuthRoutes, home: 'home' };
  }
}

export function createSession(token: LoginToken, userInfo: UserInfo, maxAgeSeconds = 60 * 60 * 24): AuthSession {
  return {
    accessToken: token.token,
    refreshToken: token.refreshToken,
    userInfo,
    expiresAt: Date.now() + maxAgeSeconds * 1000
  };
}

export function createLocalUser(userName: string): UserInfo {
  const normalized = userName || 'Super';
  const role = normalized.toLowerCase() === 'user' ? 'R_USER' : normalized.toLowerCase() === 'admin' ? 'R_ADMIN' : 'R_SUPER';

  return {
    userId: normalized.toLowerCase(),
    userName: normalized,
    roles: [role],
    buttons: role === 'R_USER' ? ['query'] : ['query', 'create', 'update', 'delete']
  };
}
