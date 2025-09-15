export const theme = {
  colors: {
    primary: '#FF6B47',
    secondary: '#FF8A65',
    background: '#1A1B23',
    surface: '#252631',
    card: '#2A2B38',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    border: '#3A3B48',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 18,
    },
  },
};