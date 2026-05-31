import { sampleDataScreenScene } from '@sa/visualization';
import { themeTokens } from '@sa/theme';
import { ScrollView, Text, View } from 'react-native';
import { NativeBadge, NativeCard } from '@/components/native-card';

export default function DataScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <View style={{ gap: 6 }}>
        <Text selectable style={{ fontSize: 28, fontWeight: '800', color: themeTokens.color.text }}>三维数据大屏</Text>
        <Text selectable style={{ color: themeTokens.color.mutedText, lineHeight: 21 }}>
          移动端首版展示静态摘要。Web 端负责完整 Three.js 交互场景。
        </Text>
      </View>
      <NativeCard title="核心指标">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {sampleDataScreenScene.metrics.map(metric => (
            <View key={metric.label} style={{ width: '47%', gap: 4, padding: 12, borderRadius: 8, backgroundColor: '#f7f9fc' }}>
              <Text selectable style={{ color: themeTokens.color.mutedText }}>{metric.label}</Text>
              <Text selectable style={{ fontSize: 22, fontWeight: '800' }}>{metric.value}</Text>
            </View>
          ))}
        </View>
      </NativeCard>
      <NativeCard title="服务节点">
        {sampleDataScreenScene.nodes.map(node => (
          <View key={node.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <Text selectable style={{ flex: 1 }}>{node.label}</Text>
            <Text selectable style={{ color: themeTokens.color.mutedText }}>{node.latencyMs}ms</Text>
            <NativeBadge label={node.status} tone={node.status === 'healthy' ? 'success' : node.status === 'warning' ? 'warning' : 'error'} />
          </View>
        ))}
      </NativeCard>
      <NativeCard title="告警">
        {sampleDataScreenScene.alerts.map(alert => (
          <View key={alert.id} style={{ gap: 4, paddingVertical: 8 }}>
            <Text selectable style={{ fontWeight: '700' }}>{alert.title}</Text>
            <Text selectable style={{ color: themeTokens.color.mutedText }}>{alert.occurredAt}</Text>
          </View>
        ))}
      </NativeCard>
    </ScrollView>
  );
}
