import { Stack } from 'expo-router/stack';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f7f9fc' }
      }}
    >
      <Stack.Screen name="login" options={{ title: '登录' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
