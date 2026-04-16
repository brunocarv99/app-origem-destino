import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { appTheme } from "@/theme/appTheme";

type SectionTitleProps = {
  children: string;
  centered?: boolean;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, centered = false, style }: SectionTitleProps) {
  return <Text style={[styles.base, centered ? styles.centered : null, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    ...appTheme.typography.section,
    color: appTheme.colors.textMuted,
    marginBottom: appTheme.spacing.sm,
  },
  centered: {
    textAlign: "center",
    alignSelf: "center",
  },
});
