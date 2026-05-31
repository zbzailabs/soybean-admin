import { HeadContent, Outlet, Scripts, createRootRoute, createRoute, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import appCss from './styles.css?url';
import { AppShell } from './shell/app-shell';
import { ExceptionPage } from './pages/exception-page';
import { getSessionServer } from './server/session';
import { Route as ApiHealthRouteImport } from './routes/api/health';

const LoginPage = lazy(() => import('./pages/login-page').then(module => ({ default: module.LoginPage })));
const HomePage = lazy(() => import('./pages/home-page').then(module => ({ default: module.HomePage })));
const ManagePage = lazy(() => import('./pages/manage-page').then(module => ({ default: module.ManagePage })));
const DataScreenPage = lazy(() => import('./pages/data-screen-page').then(module => ({ default: module.DataScreenPage })));
const SettingsPage = lazy(() => import('./pages/settings-page').then(module => ({ default: module.SettingsPage })));
const SystemLogPage = lazy(() => import('./pages/system-log-page').then(module => ({ default: module.SystemLogPage })));
const RouteWorkbenchPage = lazy(() => import('./pages/route-workbench-page').then(module => ({ default: module.RouteWorkbenchPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false
    }
  }
});

const rootRoute = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Soybean 管理系统' },
      {
        name: 'description',
        content: 'SoybeanAdmin TanStack Start admin system'
      }
    ],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  component: RootProviders,
  shellComponent: RootDocument,
  notFoundComponent: () => <ExceptionPage code="404" title="页面不存在" description="当前地址没有匹配的后台页面。" />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/home' });
  }
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
});

const forbiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/403',
  component: () => <ExceptionPage code="403" title="无权限" description="当前账号没有访问该页面的权限。" />
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: () => <ExceptionPage code="404" title="页面不存在" description="请检查地址是否正确。" />
});

const serverErrorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/500',
  component: () => <ExceptionPage code="500" title="服务器错误" description="服务暂时不可用，请稍后重试。" />
});

const apiHealthRoute = ApiHealthRouteImport.update({
  id: '/api/health',
  path: '/api/health',
  getParentRoute: () => rootRoute
} as unknown as Parameters<typeof ApiHealthRouteImport.update>[0]);

const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authed',
  beforeLoad: async ({ location }) => {
    const session = await getSessionServer();
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      });
    }
    return { session };
  },
  component: AppShell
});

const homeRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/home',
  component: HomePage
});

const manageUserRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/manage/user',
  component: () => <ManagePage view="user" />
});

const manageRoleRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/manage/role',
  component: () => <ManagePage view="role" />
});

const manageMenuRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/manage/menu',
  component: () => <ManagePage view="menu" />
});

const dataScreenRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/visualization/data-screen',
  component: DataScreenPage
});

const systemSettingsRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/system/settings',
  component: SettingsPage
});

const systemLogRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/system/logs',
  component: SystemLogPage
});

const workbenchRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: '/$',
  component: RouteWorkbenchPage
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  forbiddenRoute,
  notFoundRoute,
  serverErrorRoute,
  apiHealthRoute,
  authedRoute.addChildren([
    homeRoute,
    manageUserRoute,
    manageRoleRoute,
    manageMenuRoute,
    dataScreenRoute,
    systemSettingsRoute,
    systemLogRoute,
    workbenchRoute
  ])
]);

function RootProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="route-loading">加载中...</div>}>
        <Outlet />
      </Suspense>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
