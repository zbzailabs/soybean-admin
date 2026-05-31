import type { SoyRoute } from '@sa/domain';

export interface DashboardMetric {
  label: string;
  value: string;
  trend: number;
  icon: string;
  series: number[];
}

export const dashboardMetrics: DashboardMetric[] = [
  { label: '今日访问', value: '12,426', trend: 12.5, icon: 'Users', series: [4, 8, 5, 11, 7, 14, 12] },
  { label: '转化率', value: '3.78%', trend: 0.56, icon: 'ChartNoAxesCombined', series: [3, 4, 7, 5, 9, 6, 8] },
  { label: '新增用户', value: '1,234', trend: -4.3, icon: 'UserPlus', series: [2, 8, 4, 10, 5, 8, 7] },
  { label: '订单总数', value: '5,678', trend: 8.1, icon: 'ShoppingCart', series: [6, 5, 11, 6, 13, 9, 12] }
];

export const trafficSeries = [
  { day: '05-12', visits: 5000, orders: 1200 },
  { day: '05-13', visits: 6500, orders: 1820 },
  { day: '05-14', visits: 5100, orders: 1480 },
  { day: '05-15', visits: 7920, orders: 2300 },
  { day: '05-16', visits: 4820, orders: 1390 },
  { day: '05-17', visits: 5800, orders: 1700 },
  { day: '05-18', visits: 6240, orders: 1920 }
];

export const sourceDistribution = [
  { name: '直接访问', value: 42.6, color: '#646cff' },
  { name: '搜索引擎', value: 28.7, color: '#7c3aed' },
  { name: '社交媒体', value: 16.3, color: '#16a34a' },
  { name: '邮件推广', value: 7.8, color: '#f59e0b' },
  { name: '其他', value: 4.6, color: '#94a3b8' }
];

export const systemRows = [
  { id: 'api', name: 'API 服务', status: '正常', latency: '120ms', cpu: 23, memory: 45 },
  { id: 'db', name: '数据库', status: '正常', latency: '32ms', cpu: 18, memory: 62 },
  { id: 'cache', name: '缓存服务', status: '正常', latency: '8ms', cpu: 11, memory: 35 },
  { id: 'file', name: '文件存储', status: '正常', latency: '56ms', cpu: 27, memory: 51 },
  { id: 'queue', name: '消息队列', status: '正常', latency: '15ms', cpu: 9, memory: 28 }
];

export const projectActivities = [
  { id: '1', user: '张三', action: '创建了角色“内容编辑”', tag: '角色管理', time: '2 分钟前' },
  { id: '2', user: '李四', action: '更新了系统配置', tag: '系统设置', time: '15 分钟前' },
  { id: '3', user: '王五', action: '登录系统', tag: '登录日志', time: '28 分钟前' },
  { id: '4', user: '赵六', action: '导出了用户数据', tag: '用户管理', time: '1 小时前' },
  { id: '5', user: '孙七', action: '删除了菜单“测试菜单”', tag: '菜单管理', time: '2 小时前' }
];

export const users = [
  { id: 'U001', name: '张三', role: '内容管理员', status: '启用', email: 'zhangsan@example.com', lastLogin: '2026-05-31 09:12' },
  { id: 'U002', name: '李四', role: '系统管理员', status: '启用', email: 'lisi@example.com', lastLogin: '2026-05-31 10:45' },
  { id: 'U003', name: '王五', role: '审计员', status: '停用', email: 'wangwu@example.com', lastLogin: '2026-05-28 18:20' },
  { id: 'U004', name: '赵六', role: '运营人员', status: '启用', email: 'zhaoliu@example.com', lastLogin: '2026-05-31 13:04' }
];

export const roles = [
  { id: 'R_SUPER', name: '超级管理员', users: 2, buttons: 18, description: '拥有全部后台权限' },
  { id: 'R_ADMIN', name: '管理员', users: 8, buttons: 12, description: '管理用户、角色和业务配置' },
  { id: 'R_USER', name: '普通用户', users: 36, buttons: 4, description: '查看工作台和个人数据' }
];

export function flattenRouteRows(routes: SoyRoute[]) {
  const walk = (route: SoyRoute, depth = 0): Array<{ key: string; title: string; path: string; component: string; depth: number }> => [
    {
      key: route.name,
      title: route.meta.i18nKey ?? route.meta.title,
      path: route.path,
      component: route.component ?? 'layout',
      depth
    },
    ...(route.children?.flatMap(child => walk(child, depth + 1)) ?? [])
  ];

  return routes.flatMap(route => walk(route));
}
