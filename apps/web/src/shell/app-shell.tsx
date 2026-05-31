import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMenus, flattenRoutes, resolveRouteTitle } from '@sa/domain';
import type { MenuItem } from '@sa/domain';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { MenuIcon } from './icons';
import { ThemeProvider, useThemeMode } from './theme-context';
import { getRoutesServer, getSessionServer, logoutServer } from '#/server/session';

export function AppShell() {
  return (
    <ThemeProvider>
      <AuthenticatedShell />
    </ThemeProvider>
  );
}

function AuthenticatedShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabs, setTabs] = useState<Array<{ path: string; title: string }>>(() => {
    if (typeof window === 'undefined') return [{ path: '/home', title: '首页' }];
    const raw = window.localStorage.getItem('soybean-tabs');
    return raw ? JSON.parse(raw) : [{ path: '/home', title: '首页' }];
  });

  const sessionQuery = useQuery({ queryKey: ['session'], queryFn: () => getSessionServer() });
  const routesQuery = useQuery({ queryKey: ['routes'], queryFn: () => getRoutesServer() });

  const authRoutes = routesQuery.data?.authRoutes ?? [];
  const menus = useMemo(() => createMenus(authRoutes), [authRoutes]);
  const flatRoutes = useMemo(() => flattenRoutes(authRoutes), [authRoutes]);
  const currentRoute = flatRoutes.find(route => route.path === pathname);
  const currentTitle = currentRoute ? resolveRouteTitle(currentRoute) : '工作台';

  useEffect(() => {
    if (!currentRoute) return;
    setTabs(current => {
      const next = current.some(tab => tab.path === pathname) ? current : [...current, { path: pathname, title: currentTitle }].slice(-7);
      window.localStorage.setItem('soybean-tabs', JSON.stringify(next));
      return next;
    });
  }, [currentRoute, currentTitle, pathname]);

  const logoutMutation = useMutation({
    mutationFn: () => logoutServer(),
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: '/login' });
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={collapsed ? 'app-sidebar is-collapsed' : 'app-sidebar'}>
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">S</div>
          {!collapsed ? <strong className="truncate text-base">Soybean 管理系统</strong> : null}
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {menus.map(menu => (
            <MenuBranch key={menu.key} item={menu} collapsed={collapsed} pathname={pathname} />
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="ghost" className="w-full justify-start" onClick={() => logoutMutation.mutate()}>
            <MenuIcon name="LogOut" className="size-4" />
            {!collapsed ? '退出登录' : null}
          </Button>
        </div>
      </aside>

      <div className={collapsed ? 'app-main is-collapsed' : 'app-main'}>
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-5">
            <Button variant="ghost" size="icon" aria-label="切换侧边栏" onClick={() => setCollapsed(value => !value)}>
              <MenuIcon name="Menu" className="size-4" />
            </Button>
            <div className="hidden text-sm text-muted-foreground md:block">首页 / {currentTitle}</div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden h-10 min-w-64 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground md:flex">
                <MenuIcon name="Search" className="size-4" />
                全局搜索
                <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-xs">⌘ K</kbd>
              </div>
              <Button variant="ghost" size="icon" aria-label="语言">
                <MenuIcon name="Languages" className="size-4" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" className="gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">管</span>
                <span className="hidden sm:inline">{sessionQuery.data?.userInfo.userName ?? '管理员'}</span>
              </Button>
            </div>
          </div>
          <div className="flex h-12 items-center gap-2 overflow-x-auto border-t border-border px-5">
            {tabs.map(tab => (
              <button
                key={tab.path}
                className={tab.path === pathname ? 'app-tab is-active' : 'app-tab'}
                onClick={() => navigate({ to: tab.path })}
              >
                {tab.title}
                {tab.path !== '/home' ? <span aria-hidden>×</span> : null}
              </button>
            ))}
            <Button className="ml-auto" variant="ghost" size="icon" aria-label="更多标签">
              <MenuIcon name="ChevronsRight" className="size-4" />
            </Button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-7rem)] p-5">
          <Outlet />
        </main>
      </div>

      <ThemeDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

function MenuBranch({ item, collapsed, pathname }: { item: MenuItem; collapsed: boolean; pathname: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const active = pathname === item.path || item.children?.some(child => pathname === child.path);
  const hasChildren = Boolean(item.children?.length);

  if (hasChildren) {
    return (
      <div>
        <button className={active ? 'menu-item is-active' : 'menu-item'} onClick={() => setOpen(value => !value)}>
          <MenuIcon name={item.icon} className="size-4" />
          {!collapsed ? <span>{item.title}</span> : null}
          {!collapsed ? <MenuIcon name="ChevronDown" className={open ? 'ml-auto size-4 rotate-180' : 'ml-auto size-4'} /> : null}
        </button>
        {!collapsed && open ? (
          <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-2">
            {item.children?.map(child => <MenuBranch key={child.key} item={child} collapsed={false} pathname={pathname} />)}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button className={active ? 'menu-item is-active' : 'menu-item'} onClick={() => navigate({ to: item.path })}>
      <MenuIcon name={item.icon} className="size-4" />
      {!collapsed ? <span>{item.title}</span> : null}
    </button>
  );
}

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  return (
    <Button variant="ghost" size="icon" aria-label="主题模式" onClick={toggleMode}>
      <MenuIcon name={mode === 'light' ? 'Sun' : 'Moon'} className="size-4" />
    </Button>
  );
}

function ThemeDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!open) {
    return (
      <Button className="fixed bottom-5 right-5 z-30 shadow-lg" onClick={() => onOpenChange(true)}>
        <MenuIcon name="Settings" className="size-4" />
        主题配置
      </Button>
    );
  }

  return (
    <aside className="theme-drawer">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">主题配置</h2>
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="关闭主题配置">
          ×
        </Button>
      </div>
      <div className="flex flex-col gap-6 pt-4">
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">主题模式</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline">浅色</Button>
            <Button variant="outline">深色</Button>
            <Button variant="outline">跟随系统</Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">主色调</h3>
          <div className="flex gap-3">
            {['#646cff', '#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b', '#ef4444'].map(color => (
              <button key={color} className="size-7 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">界面密度</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button>舒适</Button>
            <Button variant="outline">紧凑</Button>
            <Button variant="outline">宽松</Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">其他设置</h3>
          {['固定侧边栏', '顶部导航栏', '显示面包屑', '动画效果'].map(label => (
            <label key={label} className="flex items-center justify-between text-sm">
              {label}
              <input type="checkbox" defaultChecked className="accent-primary" />
            </label>
          ))}
        </section>
      </div>
      <div className="mt-auto flex gap-3 pt-6">
        <Button variant="outline" className="flex-1">恢复默认</Button>
        <Button className="flex-1">保存设置</Button>
      </div>
      <Badge className="mt-4" variant="secondary">base-nova</Badge>
    </aside>
  );
}
