import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { appTheme } from "@/theme/appTheme";

type FormCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FormCard({ children, style }: FormCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.xl,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    paddingVertical: appTheme.spacing.md,
    paddingHorizontal: appTheme.spacing.md,
    shadowColor: appTheme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
