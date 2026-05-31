export type RouteKey = string;

export interface RouteQueryPair {
  key: string;
  value: string;
}

export interface RouteMeta {
  title: string;
  i18nKey?: string | null;
  roles?: string[];
  keepAlive?: boolean | null;
  constant?: boolean | null;
  icon?: string;
  localIcon?: string;
  iconFontSize?: number;
  order?: number | null;
  href?: string | null;
  hideInMenu?: boolean | null;
  activeMenu?: RouteKey | null;
  multiTab?: boolean | null;
  fixedIndexInTab?: number | null;
  query?: RouteQueryPair[] | null;
}

export interface SoyRoute {
  name: RouteKey;
  path: string;
  component?: string;
  componentKey?: string;
  redirect?: string;
  props?: boolean;
  meta: RouteMeta;
  children?: SoyRoute[];
}

export interface MenuItem {
  key: RouteKey;
  title: string;
  path: string;
  icon?: string;
  order: number;
  activeMenu?: RouteKey | null;
  children?: MenuItem[];
}

export interface UserInfo {
  userId: string;
  userName: string;
  roles: string[];
  buttons: string[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
  expiresAt: number;
}

export const STATIC_SUPER_ROLE = 'R_SUPER';

export const constantRoutes: SoyRoute[] = [
  {
    name: 'login',
    path: '/login',
    component: 'layout.blank$view.login',
    meta: { title: 'login', i18nKey: 'route.login', constant: true, hideInMenu: true }
  },
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: { title: '403', i18nKey: 'route.403', constant: true, hideInMenu: true }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: { title: '404', i18nKey: 'route.404', constant: true, hideInMenu: true }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: { title: '500', i18nKey: 'route.500', constant: true, hideInMenu: true }
  }
];

export const fallbackAuthRoutes: SoyRoute[] = [
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: { title: 'home', i18nKey: 'route.home', icon: 'LayoutDashboard', order: 1 }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: { title: 'manage', i18nKey: 'route.manage', icon: 'ShieldCheck', order: 2 },
    children: [
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: { title: 'manage_user', i18nKey: 'route.manage_user', icon: 'Users', order: 1 }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: { title: 'manage_role', i18nKey: 'route.manage_role', icon: 'UserRoundCog', order: 2 }
      },
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: { title: 'manage_menu', i18nKey: 'route.manage_menu', icon: 'Route', order: 3, keepAlive: true }
      }
    ]
  },
  {
    name: 'visualization',
    path: '/visualization',
    component: 'layout.base',
    meta: { title: 'visualization', i18nKey: 'route.visualization', icon: 'Network', order: 3 },
    children: [
      {
        name: 'visualization_data-screen',
        path: '/visualization/data-screen',
        component: 'view.visualization_data-screen',
        meta: { title: 'visualization_data-screen', i18nKey: 'route.visualization_data-screen', icon: 'Orbit', order: 1 }
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    component: 'layout.base',
    meta: { title: 'system', i18nKey: 'route.system', icon: 'Settings', order: 4 },
    children: [
      {
        name: 'system_settings',
        path: '/system/settings',
        component: 'view.system_settings',
        meta: { title: 'system_settings', i18nKey: 'route.system_settings', icon: 'SlidersHorizontal', order: 1 }
      },
      {
        name: 'system_logs',
        path: '/system/logs',
        component: 'view.system_logs',
        meta: { title: 'system_logs', i18nKey: 'route.system_logs', icon: 'ClipboardList', order: 2 }
      }
    ]
  }
];

export const routeTitleMap: Record<string, string> = {
  'route.login': '登录',
  'route.403': '无权限',
  'route.404': '页面不存在',
  'route.500': '服务器错误',
  'route.home': '首页',
  'route.manage': '权限管理',
  'route.manage_user': '用户管理',
  'route.manage_role': '角色管理',
  'route.manage_menu': '菜单管理',
  'route.system': '系统',
  'route.system_settings': '系统设置',
  'route.system_logs': '操作日志',
  'route.visualization': '图表',
  'route.visualization_data-screen': '三维数据大屏',
  'route.exception': '异常页',
  'route.about': '关于',
  'route.function': '功能',
  'route.multi-menu': '多级菜单',
  'route.user-center': '个人中心'
};

export function resolveRouteTitle(route: Pick<SoyRoute, 'name' | 'meta'>) {
  const translatedTitle = route.meta.i18nKey ? routeTitleMap[route.meta.i18nKey] : undefined;
  if (translatedTitle) {
    return translatedTitle;
  }
  return route.meta.title || route.name;
}

export function sortRoutes(routes: SoyRoute[]): SoyRoute[] {
  return routes
    .map(route => ({
      ...route,
      children: route.children ? sortRoutes(route.children) : undefined
    }))
    .sort((a, b) => (a.meta.order ?? Number.MAX_SAFE_INTEGER) - (b.meta.order ?? Number.MAX_SAFE_INTEGER));
}

export function filterRoutesByRoles(routes: SoyRoute[], roles: string[], superRole = STATIC_SUPER_ROLE): SoyRoute[] {
  if (roles.includes(superRole)) {
    return sortRoutes(routes);
  }

  const visit = (route: SoyRoute): SoyRoute | null => {
    const required = route.meta.roles ?? [];
    const hasRole = required.length === 0 || required.some(role => roles.includes(role));
    const children = route.children?.map(visit).filter((item): item is SoyRoute => Boolean(item));

    if (!hasRole && !children?.length) {
      return null;
    }

    return {
      ...route,
      children
    };
  };

  return sortRoutes(routes.map(visit).filter((item): item is SoyRoute => Boolean(item)));
}

export function flattenRoutes(routes: SoyRoute[]): SoyRoute[] {
  return routes.flatMap(route => [route, ...(route.children ? flattenRoutes(route.children) : [])]);
}

export function getRouteByPath(routes: SoyRoute[], path: string) {
  return flattenRoutes(routes).find(route => route.path === path);
}

export function routeToMenu(route: SoyRoute): MenuItem | null {
  if (route.meta.hideInMenu) {
    return null;
  }

  const children = route.children?.map(routeToMenu).filter((item): item is MenuItem => Boolean(item));

  return {
    key: route.name,
    title: resolveRouteTitle(route),
    path: route.redirect || route.path,
    icon: route.meta.icon || route.meta.localIcon,
    order: route.meta.order ?? Number.MAX_SAFE_INTEGER,
    activeMenu: route.meta.activeMenu,
    children
  };
}

export function createMenus(routes: SoyRoute[]) {
  return sortRoutes(routes).map(routeToMenu).filter((item): item is MenuItem => Boolean(item));
}

export function withComponentKeys(routes: SoyRoute[]): SoyRoute[] {
  return routes.map(route => ({
    ...route,
    componentKey: route.component?.replace('layout.base$', '').replace('layout.blank$', '').replace('view.', ''),
    children: route.children ? withComponentKeys(route.children) : undefined
  }));
}
