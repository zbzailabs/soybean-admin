export type NodeStatus = 'healthy' | 'warning' | 'critical';

export interface DataScreenNode {
  id: string;
  label: string;
  group: 'gateway' | 'service' | 'data' | 'client';
  status: NodeStatus;
  requests: number;
  latencyMs: number;
  position: [number, number, number];
}

export interface DataScreenEdge {
  id: string;
  source: string;
  target: string;
  throughput: number;
  errorRate: number;
}

export interface DataScreenMetric {
  label: string;
  value: string;
  trend: number;
}

export interface DataScreenAlert {
  id: string;
  title: string;
  severity: NodeStatus;
  nodeId: string;
  occurredAt: string;
}

export interface DataScreenScene {
  nodes: DataScreenNode[];
  edges: DataScreenEdge[];
  metrics: DataScreenMetric[];
  alerts: DataScreenAlert[];
  timeline: Array<{ time: string; requests: number; errors: number }>;
}

export const sampleDataScreenScene: DataScreenScene = {
  nodes: [
    { id: 'client-web', label: 'Web 管理端', group: 'client', status: 'healthy', requests: 12426, latencyMs: 68, position: [-5, 1, 0] },
    { id: 'client-mobile', label: '移动端', group: 'client', status: 'healthy', requests: 3820, latencyMs: 84, position: [-5, -2, 0] },
    { id: 'gateway', label: 'API 网关', group: 'gateway', status: 'healthy', requests: 16246, latencyMs: 42, position: [-1.8, 0, 0.8] },
    { id: 'auth', label: '鉴权服务', group: 'service', status: 'warning', requests: 6120, latencyMs: 128, position: [1.5, 2.2, 1.4] },
    { id: 'route', label: '菜单权限', group: 'service', status: 'healthy', requests: 5204, latencyMs: 56, position: [1.6, 0, 0.3] },
    { id: 'analytics', label: '数据分析', group: 'service', status: 'healthy', requests: 4922, latencyMs: 73, position: [1.4, -2.2, 0.9] },
    { id: 'cache', label: '缓存', group: 'data', status: 'healthy', requests: 9200, latencyMs: 15, position: [4.5, 1.2, -0.6] },
    { id: 'database', label: '数据库', group: 'data', status: 'critical', requests: 4400, latencyMs: 212, position: [4.7, -1.4, -1] }
  ],
  edges: [
    { id: 'web-gateway', source: 'client-web', target: 'gateway', throughput: 820, errorRate: 0.006 },
    { id: 'mobile-gateway', source: 'client-mobile', target: 'gateway', throughput: 260, errorRate: 0.003 },
    { id: 'gateway-auth', source: 'gateway', target: 'auth', throughput: 360, errorRate: 0.018 },
    { id: 'gateway-route', source: 'gateway', target: 'route', throughput: 420, errorRate: 0.004 },
    { id: 'gateway-analytics', source: 'gateway', target: 'analytics', throughput: 300, errorRate: 0.005 },
    { id: 'route-cache', source: 'route', target: 'cache', throughput: 520, errorRate: 0.002 },
    { id: 'analytics-db', source: 'analytics', target: 'database', throughput: 240, errorRate: 0.021 },
    { id: 'auth-db', source: 'auth', target: 'database', throughput: 180, errorRate: 0.026 }
  ],
  metrics: [
    { label: '请求总量', value: '16,246', trend: 12.5 },
    { label: '平均延迟', value: '84ms', trend: -6.2 },
    { label: '错误率', value: '0.82%', trend: 0.18 },
    { label: '可用性', value: '99.93%', trend: 0.04 }
  ],
  alerts: [
    { id: 'alert-auth', title: '鉴权服务延迟升高', severity: 'warning', nodeId: 'auth', occurredAt: '2 分钟前' },
    { id: 'alert-db', title: '数据库错误率超过阈值', severity: 'critical', nodeId: 'database', occurredAt: '8 分钟前' }
  ],
  timeline: [
    { time: '09:00', requests: 1800, errors: 12 },
    { time: '10:00', requests: 2400, errors: 18 },
    { time: '11:00', requests: 2280, errors: 16 },
    { time: '12:00', requests: 3120, errors: 31 },
    { time: '13:00', requests: 2860, errors: 22 },
    { time: '14:00', requests: 3490, errors: 36 }
  ]
};

export function normalizeScene(scene: DataScreenScene) {
  const maxRequests = Math.max(...scene.nodes.map(node => node.requests), 1);
  const maxThroughput = Math.max(...scene.edges.map(edge => edge.throughput), 1);

  return {
    nodes: scene.nodes.map(node => ({
      ...node,
      radius: 0.28 + (node.requests / maxRequests) * 0.72,
      height: node.latencyMs / 100
    })),
    edges: scene.edges.map(edge => ({
      ...edge,
      width: 0.02 + (edge.throughput / maxThroughput) * 0.1,
      particleRate: Math.max(1, Math.round(edge.throughput / 120))
    }))
  };
}

export function filterSceneByStatus(scene: DataScreenScene, statuses: NodeStatus[]) {
  const allowed = new Set(statuses);
  const nodes = scene.nodes.filter(node => allowed.has(node.status));
  const ids = new Set(nodes.map(node => node.id));

  return {
    ...scene,
    nodes,
    edges: scene.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target)),
    alerts: scene.alerts.filter(alert => ids.has(alert.nodeId))
  };
}
