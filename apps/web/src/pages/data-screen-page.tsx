import type { NodeStatus } from '@sa/visualization';
import { filterSceneByStatus } from '@sa/visualization';
import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useMemo, useState } from 'react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { ToggleButton } from '#/components/ui/toggle';
import { getDataScreenSceneServer } from '#/server/visualization';

const ThreeScene = lazy(() => import('#/components/data-screen/three-scene').then(module => ({ default: module.ThreeScene })));

const statusLabels: Record<NodeStatus, string> = {
  healthy: '正常',
  warning: '警告',
  critical: '严重'
};

export function DataScreenPage() {
  const sceneQuery = useQuery({ queryKey: ['data-screen'], queryFn: () => getDataScreenSceneServer() });
  const [statuses, setStatuses] = useState<NodeStatus[]>(['healthy', 'warning', 'critical']);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const scene = sceneQuery.data;
  const filteredScene = useMemo(() => (scene ? filterSceneByStatus(scene, statuses) : null), [scene, statuses]);
  const selectedNode = filteredScene?.nodes.find(node => node.id === selectedNodeId) ?? filteredScene?.nodes[0];

  function toggleStatus(status: NodeStatus) {
    setStatuses(current => (current.includes(status) ? current.filter(item => item !== status) : [...current, status]));
  }

  if (!scene || !filteredScene) {
    return <Card><CardContent className="p-8 text-sm text-muted-foreground">正在加载三维数据大屏...</CardContent></Card>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>三维数据大屏</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">粒子表示聚合流量强度，不表示单个用户或单次请求。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(statusLabels) as NodeStatus[]).map(status => (
              <ToggleButton key={status} active={statuses.includes(status)} onClick={() => toggleStatus(status)}>
                {statusLabels[status]}
              </ToggleButton>
            ))}
            <ToggleButton active={reducedMotion} onClick={() => setReducedMotion(value => !value)}>减少动态</ToggleButton>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-[520px] rounded-lg bg-muted" />}>
            <ThreeScene scene={filteredScene} selectedNodeId={selectedNode?.id} onSelectNode={setSelectedNodeId} reducedMotion={reducedMotion} />
          </Suspense>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>核心指标</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {scene.metrics.map(metric => (
              <div key={metric.label} className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="mt-1 text-xl font-semibold">{metric.value}</div>
                <div className={metric.trend >= 0 ? 'mt-1 text-xs text-success' : 'mt-1 text-xs text-destructive'}>
                  {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>选中节点</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {selectedNode ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">名称</span>
                  <span className="font-medium">{selectedNode.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <Badge variant={selectedNode.status === 'healthy' ? 'success' : selectedNode.status === 'warning' ? 'warning' : 'destructive'}>
                    {statusLabels[selectedNode.status]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">请求量</span>
                  <span>{selectedNode.requests.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">延迟</span>
                  <span>{selectedNode.latencyMs}ms</span>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">请选择节点。</span>
            )}
            <Button variant="outline" onClick={() => setSelectedNodeId(undefined)}>重置视角</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>告警</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {filteredScene.alerts.map(alert => (
              <div key={alert.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm">{alert.title}</strong>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'warning'}>{statusLabels[alert.severity]}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{alert.occurredAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
