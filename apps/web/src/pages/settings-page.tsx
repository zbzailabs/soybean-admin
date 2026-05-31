import { useForm } from '@tanstack/react-form';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';

export function SettingsPage() {
  const form = useForm({
    defaultValues: {
      systemTitle: 'Soybean 管理系统',
      baseUrl: 'https://mock.apifox.cn/m1/3109515-0-default',
      healthPath: '/api/health',
      themeColor: '#646cff'
    },
    onSubmit: ({ value }) => {
      window.localStorage.setItem('soybean-system-settings', JSON.stringify(value));
    }
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>系统设置</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">使用 TanStack Form 管理设置表单和校验状态。</p>
          </div>
          <Badge variant="secondary">TanStack Form</Badge>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field name="systemTitle" validators={{ onChange: ({ value }) => (!value ? '系统名称不能为空' : undefined) }}>
              {field => (
                <label className="flex flex-col gap-2 text-sm font-medium">
                  系统名称
                  <Input value={field.state.value} onChange={event => field.handleChange(event.target.value)} />
                  {field.state.meta.errors[0] ? <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span> : null}
                </label>
              )}
            </form.Field>
            <form.Field name="baseUrl" validators={{ onChange: ({ value }) => (!value.startsWith('http') ? '接口地址需要以 http 开头' : undefined) }}>
              {field => (
                <label className="flex flex-col gap-2 text-sm font-medium">
                  接口地址
                  <Input value={field.state.value} onChange={event => field.handleChange(event.target.value)} />
                  {field.state.meta.errors[0] ? <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span> : null}
                </label>
              )}
            </form.Field>
            <form.Field name="healthPath">
              {field => (
                <label className="flex flex-col gap-2 text-sm font-medium">
                  健康检查
                  <Input value={field.state.value} onChange={event => field.handleChange(event.target.value)} />
                </label>
              )}
            </form.Field>
            <form.Field name="themeColor">
              {field => (
                <label className="flex flex-col gap-2 text-sm font-medium">
                  主题颜色
                  <Input value={field.state.value} onChange={event => field.handleChange(event.target.value)} />
                </label>
              )}
            </form.Field>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit">保存设置</Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>恢复表单</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>运行配置</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {[
            ['Web SSR', 'Nitro Node'],
            ['部署目标', 'Dokploy'],
            ['会话存储', 'HttpOnly Cookie'],
            ['Mock 数据', 'Apifox']
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
