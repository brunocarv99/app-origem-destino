import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { appTheme } from "@/theme/appTheme";

type Variant = "primary" | "secondary" | "neutral";

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  fullWidth = true,
  style,
}: AppButtonProps) {
  const variantStyle =
    variant === "secondary"
      ? styles.secondary
      : variant === "neutral"
      ? styles.neutral
      : styles.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        fullWidth ? styles.fullWidth : styles.autoWidth,
        variantStyle,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: appTheme.radius.md,
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  autoWidth: {
    alignSelf: "center",
  },
  primary: {
    backgroundColor: appTheme.colors.primary,
  },
  secondary: {
    backgroundColor: appTheme.colors.accent,
  },
  neutral: {
    backgroundColor: "#1F2937",
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: "#fff",
    ...appTheme.typography.button,
  },
});
