import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { themeTokens } from '@sa/theme';

export function NativeCard({ title, children }: PropsWithChildren<{ title?: string }>) {
  return (
    <View
      style={{
        gap: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: themeTokens.color.border,
        borderRadius: themeTokens.radius.lg,
        backgroundColor: themeTokens.color.surface,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)'
      }}
    >
      {title ? <Text selectable style={{ fontSize: 16, fontWeight: '700', color: themeTokens.color.text }}>{title}</Text> : null}
      {children}
    </View>
  );
}

export function NativeBadge({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'success' | 'warning' | 'error' }) {
  const colors = {
    primary: themeTokens.color.primary,
    success: themeTokens.color.success,
    warning: themeTokens.color.warning,
    error: themeTokens.color.error
  };

  return (
    <Text
      selectable
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        overflow: 'hidden',
        color: colors[tone],
        backgroundColor: `${colors[tone]}18`,
        fontSize: 12,
        fontWeight: '600'
      }}
    >
      {label}
    </Text>
  );
}
