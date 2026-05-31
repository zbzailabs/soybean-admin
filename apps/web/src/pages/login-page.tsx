import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, LockKeyhole, UserRound } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { loginServer } from '#/server/session';

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const redirect =
    typeof window === 'undefined' ? undefined : new URLSearchParams(window.location.search).get('redirect') || undefined;
  const loginMutation = useMutation({
    mutationFn: (value: { userName: string; password: string }) => loginServer({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      await navigate({ to: redirect || '/home' });
    }
  });

  const form = useForm({
    defaultValues: {
      userName: 'Super',
      password: '123456'
    },
    onSubmit: ({ value }) => loginMutation.mutate(value)
  });

  const quickLogin = (userName: string) => {
    loginMutation.mutate({ userName, password: '123456' });
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[linear-gradient(135deg,#eef0ff_0%,#f7f9fc_48%,#ffffff_100%)] lg:grid-cols-[1fr_520px]">
      <section className="hidden flex-col justify-between p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">S</div>
          <div>
            <h1 className="text-xl font-semibold">Soybean 管理系统</h1>
            <p className="text-sm text-muted-foreground">TanStack Start + React admin workspace</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <h2 className="text-5xl font-semibold leading-tight tracking-normal text-foreground">统一管理后台、移动端与三维数据大屏。</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            保留 SoybeanAdmin 的鉴权、动态菜单、标签页和主题能力，使用 React、shadcn 风格组件与 TanStack 体系重构。
          </p>
        </div>
        <div className="grid max-w-2xl grid-cols-3 gap-3">
          {['权限路由', '表格表单', '三维大屏'].map(item => (
            <div key={item} className="rounded-lg border border-border bg-card p-4 text-sm font-medium shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div>
              <CardTitle className="text-2xl">登录</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">使用内置演示账号进入后台。</p>
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <form.Field
                name="userName"
                validators={{
                  onChange: ({ value }) => (!value ? '请输入用户名' : undefined)
                }}
              >
                {field => (
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    用户名
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" value={field.state.value} onChange={event => field.handleChange(event.target.value)} />
                    </div>
                    {field.state.meta.errors.length ? <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span> : null}
                  </label>
                )}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => (!value ? '请输入密码' : undefined)
                }}
              >
                {field => (
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    密码
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9 pr-9"
                        type="password"
                        value={field.state.value}
                        onChange={event => field.handleChange(event.target.value)}
                      />
                      <Eye className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {field.state.meta.errors.length ? <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span> : null}
                  </label>
                )}
              </form.Field>
              {loginMutation.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">登录失败，请检查网络或账号。</p> : null}
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? '登录中...' : '登录'}
              </Button>
            </form>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {['Super', 'Admin', 'User'].map(account => (
                <Button key={account} variant="outline" onClick={() => quickLogin(account)} disabled={loginMutation.isPending}>
                  {account}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
