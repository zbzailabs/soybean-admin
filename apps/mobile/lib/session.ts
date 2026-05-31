import { createLocalUser, createSession, getUserRoutesApi, loginApi } from '@sa/api';
import type { AuthSession } from '@sa/domain';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'soybean_session';

export async function readSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  const session = JSON.parse(raw) as AuthSession;
  return session.expiresAt > Date.now() ? session : null;
}

export async function writeSession(session: AuthSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function loginMobile(userName: string, password: string) {
  const token = await loginApi(userName, password);
  const session = createSession(token, createLocalUser(userName));
  await writeSession(session);
  return session;
}

export async function getMobileRoutes() {
  const session = await readSession();
  return getUserRoutesApi({ accessToken: session?.accessToken });
}
