import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { sincronizarPesquisasPendentes } from "../pesquisa";

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
          <View style={styles.modalCard}>
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
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={() => {
                  if (senha === SENHA_FIXA) {
                    setAutenticado(true);
                    setSenha("");
                    return;
                  }
                  Alert.alert("Senha incorreta");
                  setSenha("");
                }}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {autenticado && (
        <View style={styles.content}>
          <Text style={styles.title}>Sincronização</Text>

          <Pressable
            style={[styles.button, styles.syncButton, sincronizando ? styles.disabled : null]}
            disabled={sincronizando}
            onPress={() => void executarSincronizacao(false)}
          >
            <Text style={styles.buttonText}>
              {sincronizandoModo === "pendentes" ? "Sincronizando..." : "Sincronizar Pesquisas"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.resendButton, sincronizando ? styles.disabled : null]}
            disabled={sincronizando}
            onPress={confirmarReenvioTotal}
          >
            <Text style={styles.buttonText}>
              {sincronizandoModo === "todas" ? "Reenviando tudo..." : "Reenviar Todas Pesquisas"}
            </Text>
          </Pressable>

          <Pressable style={[styles.button, styles.backButton]} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Voltar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalCard: { width: 340, backgroundColor: "#fff", borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "90%",
    maxWidth: 340,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  primaryButton: { backgroundColor: "#021b36ff", flex: 1 },
  secondaryButton: { backgroundColor: "#888", flex: 1 },
  syncButton: { backgroundColor: "#191b19ff" },
  resendButton: { backgroundColor: "#7a220b" },
  backButton: { backgroundColor: "#666" },
  disabled: { opacity: 0.7 },
});
