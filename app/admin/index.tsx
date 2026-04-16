import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { FormCard } from "@/components/ui/FormCard";
import Banco from "../banco";
import ConfiguracaoScreen from "../config";
import { appTheme } from "@/theme/appTheme";

const SENHA_FIXA = "@trafego25";

export default function AdminScreen() {
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "banco" | null>(null);
  const router = useRouter();

  function validarSenha() {
    if (senha === SENHA_FIXA) {
      setAutenticado(true);
      setSenha("");
    } else {
      alert("Senha incorreta");
      setSenha("");
    }
  }

  return (
    <View style={styles.container}>
      <Modal visible={!autenticado} transparent animationType="fade" onRequestClose={() => router.back()}>
        <View style={styles.modalOverlay}>
          <FormCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Digite a senha para acessar</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              secureTextEntry
              autoFocus
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <AppButton label="Entrar" onPress={validarSenha} style={styles.modalButton} />
              <AppButton label="Voltar" onPress={() => router.back()} variant="secondary" style={styles.modalButton} />
            </View>
          </FormCard>
        </View>
      </Modal>

      {autenticado && (
        <View style={{ flex: 1, width: "100%" }}>
          <View style={styles.tabRow}>
            <Pressable style={[styles.tabButton, activeTab === "config" ? styles.tabActive : null]} onPress={() => setActiveTab("config")}>
              <Text style={styles.tabText}>Configurar Pesquisa</Text>
            </Pressable>
            <Pressable style={[styles.tabButton, activeTab === "banco" ? styles.tabActive : null]} onPress={() => setActiveTab("banco")}>
              <Text style={styles.tabText}>Visualizar Respostas</Text>
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
            {activeTab === null && <Text style={styles.helperText}>Escolha uma opção acima.</Text>}
            {activeTab === "config" && <ConfiguracaoScreen requirePassword={false} />}
            {activeTab === "banco" && <Banco requirePassword={false} />}
          </ScrollView>

          <AppButton label="Voltar" onPress={() => router.back()} variant="secondary" fullWidth={false} style={styles.footerButton} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appTheme.colors.background },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(15,23,42,0.45)" },
  modalCard: {
    width: 340,
    maxWidth: "92%",
  },
  modalTitle: {
    ...appTheme.typography.subtitle,
    marginBottom: appTheme.spacing.sm,
    textAlign: "center",
    color: appTheme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: appTheme.radius.md,
    padding: appTheme.spacing.sm,
    marginBottom: appTheme.spacing.sm,
    backgroundColor: appTheme.colors.surfaceSoft,
    color: appTheme.colors.text,
  },
  modalButton: { flex: 1 },
  footerButton: { minWidth: 120, alignSelf: "center", paddingHorizontal: appTheme.spacing.md },
  tabRow: { flexDirection: "row", padding: appTheme.spacing.sm, justifyContent: "space-between", backgroundColor: appTheme.colors.surface },
  tabButton: {
    flex: 1,
    marginHorizontal: appTheme.spacing.xs,
    paddingVertical: appTheme.spacing.sm,
    borderRadius: appTheme.radius.md,
    backgroundColor: appTheme.colors.primaryStrong,
    alignItems: "center",
  },
  tabActive: { backgroundColor: appTheme.colors.accent },
  tabText: { color: "#fff", ...appTheme.typography.button },
  helperText: { textAlign: "center", color: appTheme.colors.textMuted, marginTop: appTheme.spacing.sm, ...appTheme.typography.body },
});
