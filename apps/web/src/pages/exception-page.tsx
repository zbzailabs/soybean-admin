import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '#/components/ui/card';

export function ExceptionPage({ code, title, description }: { code: string; title: string; description: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
          <div className="text-7xl font-semibold tracking-normal text-primary">{code}</div>
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
          <Link className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" to="/home">
            返回首页
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
