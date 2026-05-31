import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';
import { ToggleButton } from '#/components/ui/toggle';
import { dashboardMetrics, projectActivities, sourceDistribution, systemRows, trafficSeries } from '#/lib/sample-data';
import { MenuIcon } from '#/shell/icons';

export function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
        <span>SoybeanAdmin 3.0 TanStack 版本已启用，新增 React、移动端与三维数据大屏。</span>
        <Button variant="ghost" size="sm">查看详情</Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map(metric => (
          <Card key={metric.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MenuIcon name={metric.icon} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {metric.label}
                  <span className="size-1 rounded-full bg-muted-foreground/40" />
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-normal">{metric.value}</div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className={metric.trend >= 0 ? 'text-success' : 'text-destructive'}>
                    {metric.trend >= 0 ? '▲' : '▼'} {Math.abs(metric.trend)}%
                  </span>
                  <span className="text-muted-foreground">较昨日</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>访问趋势</CardTitle>
            <div className="flex gap-2">
              {['今日', '本周', '本月', '本年'].map((label, index) => (
                <ToggleButton key={label} active={index === 1}>{label}</ToggleButton>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries} margin={{ left: -20, right: 12 }}>
                <defs>
                  <linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#646cff" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#646cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="#646cff" strokeWidth={2} fill="url(#visits)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>来源分布</CardTitle>
            <Button variant="outline" size="sm">本周</Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2}>
                    {sourceDistribution.map(item => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {sourceDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-3 text-sm">
                  <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                  <span className="ml-auto font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>系统状态</CardTitle>
              <div className="mt-1 flex items-center gap-2 text-sm text-success">
                <span className="size-2 rounded-full bg-success" />
                正常运行
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MenuIcon name="RefreshCw" className="size-4" />
              刷新
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务名称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>响应时间</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>内存</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemRows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell><Badge variant="success">{row.status}</Badge></TableCell>
                    <TableCell>{row.latency}</TableCell>
                    <TableCell>{row.cpu}%</TableCell>
                    <TableCell>{row.memory}%</TableCell>
                    <TableCell><Button variant="ghost" size="sm">详情</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>项目动态</CardTitle>
            <Button variant="ghost" size="sm">查看全部</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {projectActivities.map(activity => (
              <div key={activity.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {activity.user.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm"><strong>{activity.user}</strong> {activity.action}</p>
                  <Badge variant="secondary" className="mt-1">{activity.tag}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
