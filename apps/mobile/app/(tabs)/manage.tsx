import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { createMenus } from '@sa/domain';
import type { MenuItem } from '@sa/domain';
import { themeTokens } from '@sa/theme';
import { NativeBadge, NativeCard } from '@/components/native-card';
import { getMobileRoutes, readSession } from '@/lib/session';

export default function ManageScreen() {
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      readSession().then(value => {
        if (!value) router.replace('/login');
      });
      getMobileRoutes().then(data => setMenus(createMenus(data.routes)));
    }, [])
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <Text selectable style={{ fontSize: 28, fontWeight: '800', color: themeTokens.color.text }}>权限管理</Text>
      <NativeCard title="同一权限模型">
        <Text selectable style={{ color: themeTokens.color.mutedText, lineHeight: 21 }}>
          移动端使用与 Web 相同的角色、菜单和按钮权限合同，只用原生导航呈现。
        </Text>
      </NativeCard>
      {menus.map(menu => (
        <NativeCard key={menu.key} title={menu.title}>
          {menu.children?.map(child => (
            <View key={child.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}>
              <Text selectable style={{ flex: 1 }}>{child.title}</Text>
              <NativeBadge label={child.path} />
            </View>
          ))}
        </NativeCard>
      ))}
    </ScrollView>
  );
}
