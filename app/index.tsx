import { FormCard } from "@/components/ui/FormCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { appTheme } from "@/theme/appTheme";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>A serviço do DER/MG</Text>
            <Image
              source={require("../assets/images/logo-der.png")}
              style={styles.logoDer}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.headerBand}>
          <Text style={styles.helperText}>Escolha uma ação para começar.</Text>
        </View>

        <FormCard style={styles.actionsCard}>
          <SectionTitle centered style={styles.sectionTitle}>Iniciar Entrevistas</SectionTitle>

          <Link href={{ pathname: "/pesquisa", params: { tipo: "passeio" } }} asChild>
            <Pressable style={styles.primaryActionButton}>
              <Text style={styles.buttonText}>Passeio</Text>
            </Pressable>
          </Link>

          <Link href={{ pathname: "/pesquisa", params: { tipo: "caminhao" } }} asChild>
            <Pressable style={styles.primaryActionButton}>
              <Text style={styles.buttonText}>Caminhão</Text>
            </Pressable>
          </Link>

          <Link href={{ pathname: "/pesquisa", params: { tipo: "onibus" } }} asChild>
            <Pressable style={styles.primaryActionButton}>
              <Text style={styles.buttonText}>Ônibus</Text>
            </Pressable>
          </Link>
        </FormCard>

        <View style={styles.managementRow}>
          <Link href="/admin" asChild>
            <Pressable style={styles.secondaryActionButton}>
              <Text style={styles.buttonText}>Configurar Pesquisa</Text>
            </Pressable>
          </Link>

          <Link href="/sincronizacao" asChild>
            <Pressable style={styles.darkActionButton}>
              <Text style={styles.buttonText}>Enviar Pesquisas</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
    alignItems: "center",
  },
  logoWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: appTheme.spacing.xs,
  },
  logo: {
    width: 182,
    height: 182,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: appTheme.spacing.md,
    paddingBottom: 24,
  },
  headerBand: {
    width: "100%",
    maxWidth: 440,
    marginTop: 0,
    marginBottom: appTheme.spacing.sm,
    alignItems: "center",
  },
  actionsCard: { maxWidth: 440 },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: appTheme.spacing.sm,
    marginTop: 0,
    width: "100%",
  },
  subtitle: {
    ...appTheme.typography.label,
    color: "#4B5563",
    marginRight: appTheme.spacing.xs,
  },
  logoDer: {
    width: 35,
    height: 35,
  },
  helperText: {
    ...appTheme.typography.body,
    color: appTheme.colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  sectionTitle: {
    alignSelf: "center",
    color: appTheme.colors.primaryStrong,
    backgroundColor: "#EEF2F7",
    paddingHorizontal: appTheme.spacing.sm,
    paddingVertical: appTheme.spacing.xs,
    borderRadius: 999,
    marginBottom: appTheme.spacing.sm,
  },
  primaryActionButton: {
    backgroundColor: appTheme.colors.primary,
    paddingVertical: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.sm,
    borderRadius: appTheme.radius.md,
    marginVertical: 5,
    width: "100%",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  managementRow: {
    marginTop: appTheme.spacing.sm,
    width: "100%",
    maxWidth: 440,
    flexDirection: "row",
    gap: appTheme.spacing.xs,
  },
  secondaryActionButton: {
    backgroundColor: appTheme.colors.accent,
    paddingVertical: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.sm,
    borderRadius: appTheme.radius.md,
    marginVertical: 4,
    width: "50%",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  darkActionButton: {
    backgroundColor: "#1F2937",
    paddingVertical: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.sm,
    borderRadius: appTheme.radius.md,
    marginVertical: 4,
    width: "50%",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    ...appTheme.typography.button,
  },
});
