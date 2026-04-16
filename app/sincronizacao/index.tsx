import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { FormCard } from "@/components/ui/FormCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { sincronizarPesquisasPendentes } from "../pesquisa";
import { appTheme } from "@/theme/appTheme";

const SENHA_FIXA = "@trafego25";

export default function SincronizacaoScreen() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [sincronizandoModo, setSincronizandoModo] = useState<"pendentes" | "todas" | null>(null);

  const sincronizando = sincronizandoModo !== null;

  const executarSincronizacao = async (forcarReenvio: boolean) => {
    if (sincronizando) return;
    setSincronizandoModo(forcarReenvio ? "todas" : "pendentes");
    try {
      await sincronizarPesquisasPendentes({ forcarReenvio });
    } finally {
      setSincronizandoModo(null);
    }
  };

  const confirmarReenvioTotal = () => {
    if (sincronizando) return;
    if (Platform.OS === "web") {
      const confirmou =
        typeof window !== "undefined"
          ? window.confirm("Reenviar todas as pesquisas? Isso pode gerar duplicidade no servidor.")
          : false;
      if (confirmou) {
        void executarSincronizacao(true);
      }
      return;
    }

    Alert.alert(
      "Reenviar todas as pesquisas?",
      "Use apenas em recuperacao. Isso pode gerar duplicidade no servidor.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reenviar tudo",
          style: "destructive",
          onPress: () => {
            void executarSincronizacao(true);
          },
        },
      ]
    );
  };

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
            <View style={styles.row}>
              <AppButton
                label="Entrar"
                style={styles.flexButton}
                onPress={() => {
                  if (senha === SENHA_FIXA) {
                    setAutenticado(true);
                    setSenha("");
                    return;
                  }
                  Alert.alert("Senha incorreta");
                  setSenha("");
                }}
              />
              <AppButton label="Voltar" variant="secondary" style={styles.flexButton} onPress={() => router.back()} />
            </View>
          </FormCard>
        </View>
      </Modal>

      {autenticado && (
        <View style={styles.content}>
          <SectionTitle centered style={styles.title}>Sincronização</SectionTitle>

          <AppButton
            label={sincronizandoModo === "pendentes" ? "Sincronizando..." : "Sincronizar Pesquisas"}
            disabled={sincronizando}
            variant="neutral"
            onPress={() => void executarSincronizacao(false)}
            style={styles.syncButton}
          />

          <AppButton
            label={sincronizandoModo === "todas" ? "Reenviando tudo..." : "Reenviar Todas Pesquisas"}
            disabled={sincronizando}
            variant="secondary"
            onPress={confirmarReenvioTotal}
            style={styles.resendButton}
          />

          <AppButton label="Voltar" variant="secondary" onPress={() => router.back()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appTheme.colors.background },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  title: { ...appTheme.typography.subtitle, marginBottom: appTheme.spacing.sm, color: appTheme.colors.text },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(15,23,42,0.45)" },
  modalCard: {
    width: 340,
    maxWidth: "92%",
  },
  modalTitle: { ...appTheme.typography.subtitle, marginBottom: appTheme.spacing.sm, textAlign: "center", color: appTheme.colors.text },
  input: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: appTheme.radius.md,
    padding: appTheme.spacing.sm,
    marginBottom: appTheme.spacing.sm,
    backgroundColor: appTheme.colors.surfaceSoft,
    color: appTheme.colors.text,
    ...appTheme.typography.body,
  },
  row: { flexDirection: "row", gap: 12 },
  flexButton: { flex: 1 },
  syncButton: { width: "90%", maxWidth: 340, backgroundColor: appTheme.colors.primary },
  resendButton: { width: "90%", maxWidth: 340, backgroundColor: appTheme.colors.accent },
});
