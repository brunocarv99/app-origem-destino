export const appTheme = {
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceSoft: "#F5F6F8",
    primary: "#111827",
    primaryStrong: "#0B1220",
    accent: "#5B6472",
    text: "#0F172A",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    brandYellow: "#F2C230",
    danger: "#B42318",
    success: "#2E5F9E",
    shadow: "#102445",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: {
      fontSize: 30,
      fontWeight: "800" as const,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      lineHeight: 28,
    },
    section: {
      fontSize: 14,
      fontWeight: "800" as const,
      letterSpacing: 0.9,
      textTransform: "uppercase" as const,
      lineHeight: 20,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 22,
    },
    label: {
      fontSize: 16,
      fontWeight: "700" as const,
      lineHeight: 22,
    },
    button: {
      fontSize: 16,
      fontWeight: "700" as const,
      lineHeight: 20,
    },
  },
};
