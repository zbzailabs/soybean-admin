export const themeTokens = {
  color: {
    background: '#f7f9fc',
    surface: '#ffffff',
    text: '#111827',
    mutedText: '#6b7280',
    border: '#e5e7eb',
    primary: '#646cff',
    primarySoft: '#eef0ff',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#2080f0'
  },
  radius: {
    sm: 4,
    md: 6,
    lg: 8
  },
  shell: {
    siderWidth: 228,
    siderCollapsedWidth: 64,
    headerHeight: 64,
    tabHeight: 52
  }
} as const;

export type ThemeTokens = typeof themeTokens;

export function toCssVariables(tokens: ThemeTokens = themeTokens) {
  return {
    '--background': tokens.color.background,
    '--surface': tokens.color.surface,
    '--foreground': tokens.color.text,
    '--muted-foreground': tokens.color.mutedText,
    '--border': tokens.color.border,
    '--primary': tokens.color.primary,
    '--primary-soft': tokens.color.primarySoft,
    '--success': tokens.color.success,
    '--warning': tokens.color.warning,
    '--destructive': tokens.color.error,
    '--info': tokens.color.info,
    '--radius': `${tokens.radius.md}px`
  };
}
