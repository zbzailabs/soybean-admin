import { Badge } from '#/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';

const logs = [
  { id: 'L001', user: 'Super', action: '登录系统', module: '鉴权', ip: '127.0.0.1', time: '2026-05-31 09:10:12', level: 'info' },
  { id: 'L002', user: 'Admin', action: '修改角色权限', module: '权限管理', ip: '127.0.0.1', time: '2026-05-31 10:12:43', level: 'success' },
  { id: 'L003', user: 'User', action: '访问受限菜单', module: '路由守卫', ip: '127.0.0.1', time: '2026-05-31 11:40:08', level: 'warning' },
  { id: 'L004', user: 'Super', action: '打开三维数据大屏', module: '图表', ip: '127.0.0.1', time: '2026-05-31 13:22:51', level: 'info' }
];

export function SystemLogPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>操作日志</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>编号</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>模块</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>时间</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>{log.time}</TableCell>
                <TableCell><Badge variant={log.level === 'warning' ? 'warning' : 'success'}>{log.level}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
