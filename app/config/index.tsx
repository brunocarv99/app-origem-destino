import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Defina a senha fixa aqui
const SENHA_FIXA = "@trafego25";

export default function ConfiguracaoScreen() {
  const router = useRouter();
  const [rodovia, setRodovia] = useState("");
  const [posto, setPosto] = useState("");
  const [data, setData] = useState("");
  const [sentidoDe, setSentidoDe] = useState("");
  const [sentidoPara, setSentidoPara] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showResumo, setShowResumo] = useState(false);

  // Estados para controle do acesso
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [showSenhaModal, setShowSenhaModal] = useState(true);
  const [erroSenha, setErroSenha] = useState(""); 

  useEffect(() => {
    setShowSenhaModal(true);
    setAcessoLiberado(false);
  }, []);

  function validarSenha() {
    if (senhaDigitada === SENHA_FIXA) {
      setAcessoLiberado(true);
      setShowSenhaModal(false);
      setSenhaDigitada("");
      setErroSenha("");
    } else {
      setErroSenha("Senha incorreta"); 
      setSenhaDigitada("");
    }
  }

  async function salvarConfiguracao() {
    try {
      const respostasFixas = { rodovia, posto, data, sentidoDe, sentidoPara };
      await AsyncStorage.setItem("configuracaoPesquisa", JSON.stringify(respostasFixas));
      await AsyncStorage.setItem("respostasFixas", JSON.stringify(respostasFixas));
      await AsyncStorage.setItem("senhaRestricao", SENHA_FIXA);
      setShowResumo(true);
      router.replace('/'); // Volta para tela inicial
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a configuração.");
    }
  }

  const salvarPesquisa = async (respostasPesquisa) => {
    try {
      // Recupera respostas fixas
      const respostasFixasStr = await AsyncStorage.getItem("respostasFixas");
      const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};

      // Junta respostas fixas com as da pesquisa
      const pesquisaCompleta = {
        ...respostasPesquisa,
        respostasFixas,
        data: new Date().toISOString(),
      };

      // Salva no AsyncStorage (exemplo para lista de pesquisas)
      const pesquisasStr = await AsyncStorage.getItem("pesquisas");
      const pesquisas = pesquisasStr ? JSON.parse(pesquisasStr) : [];
      pesquisas.push(pesquisaCompleta);
      await AsyncStorage.setItem("pesquisas", JSON.stringify(pesquisas));

      // ...feedback para usuário...
    } catch (err) {
      // ...tratamento de erro...
    }
  };

  const salvarPesquisaLocal = async (dados) => {
    try {
      // Recupera respostas fixas
      const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
      const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};

      // Junta respostas fixas como campos individuais
      const dadosComFixas = {
        ...dados,
        ...respostasFixas, // cada campo será incluído diretamente
      };

      // Recupera pesquisas já salvas (array) ou inicia um novo
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      const pesquisas = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];
      pesquisas.push(dadosComFixas);
      await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
      Alert.alert('Pesquisa salva localmente!');
    } catch (e) {
      Alert.alert('Erro ao salvar pesquisa');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Modal de senha para liberar acesso */}
      <Modal
        visible={showSenhaModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>Digite a senha para acessar</Text>
            <TextInput
              style={styles.input}
              value={senhaDigitada}
              onChangeText={setSenhaDigitada}
              placeholder="Senha"
              secureTextEntry
              autoFocus
            />
            {erroSenha ? (
              <Text style={{ color: "red", marginBottom: 8 }}>{erroSenha}</Text>
            ) : null}
            <View style={{ flexDirection: "row", marginTop: 24, gap: 12 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#021b36ff", flex: 1 }]}
                onPress={validarSenha}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#888", flex: 1 }]}
                onPress={() => {
                  setShowSenhaModal(false);
                  setSenhaDigitada("");
                  setErroSenha("");
                }}
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Só mostra o conteúdo se o acesso estiver liberado */}
      {acessoLiberado && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Configurar Pesquisa</Text>

          <Text style={styles.label}>Rodovia:</Text>
          <TextInput
            style={styles.input}
            value={rodovia}
            onChangeText={setRodovia}
            placeholder="Digite a rodovia"
          />

          <Text style={styles.label}>Posto:</Text>
          <TextInput
            style={styles.input}
            value={posto}
            onChangeText={setPosto}
            placeholder="Digite o posto"
          />

          <Text style={styles.label}>Data:</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              style={{
                ...styles.input,
                padding: 8,
                fontSize: 16,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 16,
                backgroundColor: "#f9f9f9",
              }}
              value={
                data
                  ? `${data.split("/")[2]}-${data.split("/")[1].padStart(2, "0")}-${data
                      .split("/")[0]
                      .padStart(2, "0")}`
                  : ""
              }
              onChange={e => {
                const [year, month, day] = e.target.value.split("-");
                setData(`${day}/${month}/${year}`);
              }}
            />
          ) : (
            <>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={data}
                  placeholder="Selecione a data"
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={data ? new Date(data.split("/").reverse().join("-")) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const d = selectedDate;
                      const formatted = `${String(d.getDate()).padStart(2, "0")}/${String(
                        d.getMonth() + 1
                      ).padStart(2, "0")}/${d.getFullYear()}`;
                      setData(formatted);
                    }
                  }}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Sentido de:</Text>
          <TextInput
            style={styles.input}
            value={sentidoDe}
            onChangeText={setSentidoDe}
            placeholder="Sentido de"
          />

          <Text style={styles.label}>Sentido para:</Text>
          <TextInput
            style={styles.input}
            value={sentidoPara}
            onChangeText={setSentidoPara}
            placeholder="Sentido para"
          />

          <Pressable
            style={{
              ...styles.button,
              backgroundColor: "#021b36ff",
            }}
            onPress={salvarConfiguracao}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </Pressable>

          <Pressable
            style={{
              ...styles.button,
              backgroundColor: "#072531a4",
            }}
            onPress={() => {
              if (typeof window !== 'undefined' && window.history) {
                window.history.back();
              } else {
                Alert.alert('Voltar', 'Função de voltar não disponível nesta plataforma.');
              }
            }}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </Pressable>

          {/* Modal de resumo */}
          <Modal
            visible={showResumo}
            transparent
            animationType="fade"
            onRequestClose={() => setShowResumo(false)}
          >
            <View style={modalStyles.overlay}>
              <View style={modalStyles.card}>
                <Text style={modalStyles.title}>Resumo da Configuração</Text>
                <Text style={modalStyles.label}>
                  Rodovia:{" "}
                  <Text style={modalStyles.value}>{rodovia}</Text>
                </Text>
                <Text style={modalStyles.label}>
                  Posto: <Text style={modalStyles.value}>{posto}</Text>
                </Text>
                <Text style={modalStyles.label}>
                  Data: <Text style={modalStyles.value}>{data}</Text>
                </Text>
                <Text style={modalStyles.label}>
                  Sentido de:{" "}
                  <Text style={modalStyles.value}>{sentidoDe}</Text>
                </Text>
                <Text style={modalStyles.label}>
                  Sentido para:{" "}
                  <Text style={modalStyles.value}>{sentidoPara}</Text>
                </Text>
                <View style={{ flexDirection: "row", marginTop: 24, gap: 12 }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#072531a4", flex: 1 }]}
                    onPress={() => setShowResumo(false)}
                  >
                    <Text style={styles.buttonText}>Alterar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#021b36ff", flex: 1 }]}
                    onPress={() => setShowResumo(false)}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </View>
  );
}

// Adicione fora do componente principal:
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#021b36ff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#021b36ff",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});