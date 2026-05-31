import { describe, expect, it } from 'vitest';
import { createMenus, fallbackAuthRoutes, filterRoutesByRoles, flattenRoutes, withComponentKeys } from './index';

describe('domain route helpers', () => {
  it('filters protected route branches by role and keeps public children', () => {
    const routes = [
      {
        name: 'root',
        path: '/root',
        component: 'layout.base',
        meta: { title: 'root' },
        children: [
          { name: 'open', path: '/root/open', component: 'view.open', meta: { title: 'open' } },
          { name: 'admin', path: '/root/admin', component: 'view.admin', meta: { title: 'admin', roles: ['admin'] } }
        ]
      }
    ];

    const filtered = filterRoutesByRoles(routes, ['user']);

    expect(flattenRoutes(filtered).map(route => route.name)).toEqual(['root', 'open']);
  });

  it('creates menu labels from i18n keys and excludes hidden routes', () => {
    const menus = createMenus(fallbackAuthRoutes);

    expect(menus.map(menu => menu.title)).toContain('首页');
    expect(menus.flatMap(menu => menu.children ?? []).map(menu => menu.title)).toContain('三维数据大屏');
  });

  it('adds stable component keys from Soybean component strings', () => {
    const [home] = withComponentKeys(fallbackAuthRoutes);

    expect(home?.componentKey).toBe('home');
  });
});
