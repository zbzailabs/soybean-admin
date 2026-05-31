import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { themeTokens } from '@sa/theme';
import { loginMobile } from '@/lib/session';

export default function LoginScreen() {
  const [userName, setUserName] = useState('Super');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(name = userName) {
    setLoading(true);
    setError('');
    try {
      await loginMobile(name, password);
      await Haptics.selectionAsync();
      router.replace('/(tabs)/home');
    } catch {
      setError('登录失败，请检查网络或账号。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 20, padding: 24 }}>
      <View style={{ gap: 8 }}>
        <Text selectable style={{ fontSize: 32, fontWeight: '800', color: themeTokens.color.text }}>Soybean 管理系统</Text>
        <Text selectable style={{ fontSize: 15, lineHeight: 22, color: themeTokens.color.mutedText }}>移动端复用 Web 鉴权、菜单和权限模型。</Text>
      </View>
      <View style={{ gap: 12, padding: 16, borderRadius: 12, backgroundColor: themeTokens.color.surface, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="用户名"
          autoCapitalize="none"
          style={{ height: 46, borderWidth: 1, borderColor: themeTokens.color.border, borderRadius: 8, paddingHorizontal: 12 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="密码"
          secureTextEntry
          style={{ height: 46, borderWidth: 1, borderColor: themeTokens.color.border, borderRadius: 8, paddingHorizontal: 12 }}
        />
        {error ? <Text selectable style={{ color: themeTokens.color.error }}>{error}</Text> : null}
        <Pressable
          disabled={loading}
          onPress={() => submit()}
          style={{ height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: themeTokens.color.primary, opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? '登录中...' : '登录'}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Super', 'Admin', 'User'].map(account => (
            <Pressable
              key={account}
              onPress={() => submit(account)}
              style={{ flex: 1, height: 38, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: themeTokens.color.border, borderRadius: 8 }}
            >
              <Text>{account}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
