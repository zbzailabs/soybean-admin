import { useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';
import { flattenRouteRows, roles, users } from '#/lib/sample-data';
import { getRoutesServer } from '#/server/session';

type ManageView = 'user' | 'role' | 'menu';

export function ManagePage({ view }: { view: ManageView }) {
  if (view === 'role') return <RoleManage />;
  if (view === 'menu') return <MenuManage />;
  return <UserManage />;
}

function UserManage() {
  const columns: Array<ColumnDef<(typeof users)[number]>> = [
    { accessorKey: 'id', header: '编号' },
    { accessorKey: 'name', header: '姓名' },
    { accessorKey: 'role', header: '角色' },
    {
      accessorKey: 'status',
      header: '状态',
      cell: info => <Badge variant={info.getValue() === '启用' ? 'success' : 'warning'}>{String(info.getValue())}</Badge>
    },
    { accessorKey: 'email', header: '邮箱' },
    { accessorKey: 'lastLogin', header: '最后登录' },
    {
      id: 'actions',
      header: '操作',
      cell: () => <Button variant="ghost" size="sm">编辑</Button>
    }
  ];

  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <CrudCard title="用户管理" description="管理后台账号、角色和启停状态。">
      <DataTable table={table} />
    </CrudCard>
  );
}

function RoleManage() {
  const columns: Array<ColumnDef<(typeof roles)[number]>> = [
    { accessorKey: 'id', header: '角色编码' },
    { accessorKey: 'name', header: '角色名称' },
    { accessorKey: 'users', header: '用户数' },
    { accessorKey: 'buttons', header: '按钮权限' },
    { accessorKey: 'description', header: '说明' },
    {
      id: 'actions',
      header: '操作',
      cell: () => <Button variant="ghost" size="sm">授权</Button>
    }
  ];
  const table = useReactTable({ data: roles, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <CrudCard title="角色管理" description="角色决定菜单、按钮与数据访问范围。">
      <DataTable table={table} />
    </CrudCard>
  );
}

function MenuManage() {
  const routesQuery = useQuery({ queryKey: ['routes'], queryFn: () => getRoutesServer() });
  const rows = flattenRouteRows(routesQuery.data?.authRoutes ?? []);
  const columns: Array<ColumnDef<(typeof rows)[number]>> = [
    {
      accessorKey: 'title',
      header: '菜单名称',
      cell: info => <span style={{ paddingLeft: `${info.row.original.depth * 18}px` }}>{String(info.getValue())}</span>
    },
    { accessorKey: 'path', header: '路由地址' },
    { accessorKey: 'component', header: '组件' },
    {
      id: 'actions',
      header: '操作',
      cell: () => <Button variant="ghost" size="sm">配置</Button>
    }
  ];
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <CrudCard title="菜单管理" description="Apifox 菜单合同经过 React componentKey 映射后渲染。">
      <DataTable table={table} />
    </CrudCard>
  );
}

function CrudCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <Input className="w-56" placeholder="请输入关键词搜索" />
          <Button variant="outline">重置</Button>
          <Button>新增</Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DataTable<T>({ table }: { table: ReturnType<typeof useReactTable<T>> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
