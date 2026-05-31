import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { themeTokens } from '@sa/theme';
import type { AuthSession } from '@sa/domain';
import { NativeBadge, NativeCard } from '@/components/native-card';
import { readSession } from '@/lib/session';

const metrics = [
  ['今日访问', '12,426', '+12.5%'],
  ['转化率', '3.78%', '+0.56%'],
  ['新增用户', '1,234', '-4.3%'],
  ['订单总数', '5,678', '+8.1%']
];

export default function HomeScreen() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useFocusEffect(
    useCallback(() => {
      readSession().then(value => {
        if (!value) router.replace('/login');
        setSession(value);
      });
    }, [])
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <View style={{ gap: 4 }}>
        <Text selectable style={{ fontSize: 28, fontWeight: '800', color: themeTokens.color.text }}>首页</Text>
        <Text selectable style={{ color: themeTokens.color.mutedText }}>欢迎回来，{session?.userInfo.userName ?? '管理员'}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {metrics.map(([label, value, trend]) => (
          <View key={label} style={{ width: '47%' }}>
            <NativeCard>
              <Text selectable style={{ color: themeTokens.color.mutedText }}>{label}</Text>
              <Text selectable style={{ fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{value}</Text>
              <Text selectable style={{ color: trend.startsWith('-') ? themeTokens.color.error : themeTokens.color.success }}>{trend}</Text>
            </NativeCard>
          </View>
        ))}
      </View>
      <NativeCard title="项目动态">
        {['创建角色“内容编辑”', '更新系统配置', '打开三维数据大屏'].map((item, index) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <Text selectable style={{ flex: 1 }}>{item}</Text>
            <NativeBadge label={index === 2 ? '图表' : '管理'} />
          </View>
        ))}
      </NativeCard>
      <Pressable onPress={() => router.push('/(tabs)/data-screen')} style={{ padding: 16, borderRadius: 10, backgroundColor: themeTokens.color.primary }}>
        <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>查看三维数据大屏</Text>
      </Pressable>
    </ScrollView>
  );
}
