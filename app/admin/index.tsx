import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Banco from "../banco";
import ConfiguracaoScreen from "../config";

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
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable style={[styles.button, { flex: 1, backgroundColor: "#021b36ff" }]} onPress={validarSenha}>
                <Text style={styles.buttonText}>Entrar</Text>
              </Pressable>
              <Pressable style={[styles.button, { flex: 1, backgroundColor: "#888" }]} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Voltar</Text>
              </Pressable>
            </View>
          </View>
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
            {activeTab === null && <Text style={{ textAlign: "center", color: "#666" }}>Escolha uma opção acima.</Text>}
            {activeTab === "config" && <ConfiguracaoScreen requirePassword={false} />}
            {activeTab === "banco" && <Banco requirePassword={false} />}
          </ScrollView>

          <Pressable style={[styles.button, { margin: 12, backgroundColor: "#666" }]} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Voltar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalCard: { width: 340, backgroundColor: "#fff", borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { borderRadius: 8, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  tabRow: { flexDirection: "row", padding: 12, justifyContent: "space-between" },
  tabButton: { flex: 1, marginHorizontal: 6, paddingVertical: 10, borderRadius: 8, backgroundColor: "#021b36ff", alignItems: "center" },
  tabActive: { backgroundColor: "#072531a4" },
  tabText: { color: "#fff", fontWeight: "700" },
});
