import { useRouterState } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';

export function RouteWorkbenchPage() {
  const pathname = useRouterState({ select: state => state.location.pathname });

  return (
    <Card>
      <CardHeader>
        <CardTitle>路由工作台</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>当前路由来自动态菜单，首版使用统一工作台承接未实现的演示页面。</p>
        <p className="rounded-md bg-muted p-3 font-mono text-foreground">{pathname}</p>
        <p>菜单、标签页、面包屑和权限流程仍会按真实路由合同执行。</p>
      </CardContent>
    </Card>
  );
}
