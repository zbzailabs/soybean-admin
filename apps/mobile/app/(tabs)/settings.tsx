import { router } from 'expo-router';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { themeTokens } from '@sa/theme';
import { NativeCard } from '@/components/native-card';
import { clearSession } from '@/lib/session';

export default function SettingsScreen() {
  async function logout() {
    await clearSession();
    router.replace('/login');
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ gap: 16, padding: 16 }}>
      <Text selectable style={{ fontSize: 28, fontWeight: '800', color: themeTokens.color.text }}>设置</Text>
      <NativeCard title="界面设置">
        {['固定侧边栏', '显示面包屑', '动画效果'].map(item => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <Text selectable>{item}</Text>
            <Switch value />
          </View>
        ))}
      </NativeCard>
      <NativeCard title="运行信息">
        {[
          ['鉴权', 'SecureStore'],
          ['导航', 'Expo Router NativeTabs'],
          ['接口', 'Apifox Mock'],
          ['权限', '共享角色模型']
        ].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
            <Text selectable style={{ color: themeTokens.color.mutedText }}>{label}</Text>
            <Text selectable style={{ fontWeight: '700' }}>{value}</Text>
          </View>
        ))}
      </NativeCard>
      <Pressable onPress={logout} style={{ height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: themeTokens.color.error }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>退出登录</Text>
      </Pressable>
    </ScrollView>
  );
}
