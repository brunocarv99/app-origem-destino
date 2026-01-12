// app/banco/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Senha fixa igual à configuração
const SENHA_FIXA = "@trafego25";


export default function Banco() {
  const [respostas, setRespostas] = useState([]);
  const [totalHoje, setTotalHoje] = useState(0);
  const [totalPasseio, setTotalPasseio] = useState(0);
  const [totalCaminhao, setTotalCaminhao] = useState(0);
  const [totalOnibus, setTotalOnibus] = useState(0);

  // Controle de senha
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
      // Após liberar, carrega as respostas
      fetchLocais();
    } else {
      setErroSenha("Senha incorreta");
      setSenhaDigitada("");
    }
  }

  async function fetchLocais() {
    const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
    const todasLocais = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];

    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    const locaisDoDia = todasLocais.filter((p) => {
      if (!p.data) return false;
      const data = new Date(p.data);
      return (
        data.getDate() === dia &&
        data.getMonth() === mes &&
        data.getFullYear() === ano
      );
    });

    setTotalHoje(locaisDoDia.length);
    setRespostas(locaisDoDia);

    // Contagem por tipo
    setTotalPasseio(
      locaisDoDia.filter(
        p =>
          p.tipoVeiculo === "Passeio" ||
          p.tipoVeiculo === "Moto" ||
          p.tipoVeiculo === "Utilitario"
      ).length
    );
    setTotalCaminhao(
      locaisDoDia.filter(p => !!p.classeCaminhao).length
    );
    setTotalOnibus(
      locaisDoDia.filter(p => !!p.tipoOnibus).length
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal de senha para liberar acesso */}
      <Modal
        visible={showSenhaModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 320, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Digite a senha para acessar</Text>
            <TextInput
              style={[styles.input, { marginBottom: 12 }]}
              value={senhaDigitada}
              onChangeText={setSenhaDigitada}
              placeholder="Senha"
              secureTextEntry
              autoFocus
            />
            {erroSenha ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>{erroSenha}</Text>
            ) : null}
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#021b36ff', flex: 1 }]}
                onPress={validarSenha}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#888', flex: 1 }]}
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
        <>
          <Text style={styles.title}>Respostas Salvas</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            Pesquisas respondidas hoje: {totalHoje}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            Respostas Salvas para Passeio: {totalPasseio}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            Respostas Salvas para Caminhões: {totalCaminhao}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 16 }}>
            Respostas Salvas para Ônibus: {totalOnibus}
          </Text>
          <ScrollView style={{ width: '100%' }}>
            {respostas.length === 0 ? (
              <Text style={styles.empty}>Nenhuma resposta salva.</Text>
            ) : (
              respostas.map((item, idx) => (
                <View key={idx} style={styles.card}>
                  <Text>
                    Data/Hora: {item.data ? new Date(item.data).toLocaleString("pt-BR") : ""}
                  </Text>
                  {Object.entries(item).map(([key, value]) => (
                    <View key={key} style={styles.row}>
                      <Text style={styles.label}>{key}:</Text>
                      <Text style={styles.value}>{String(value)}</Text>
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  total: { fontSize: 16, marginBottom: 12, color: '#333' },
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: 'bold', marginRight: 6, color: '#021b36ff' },
  value: { flex: 1, color: '#333' },
  empty: { fontSize: 14, color: '#888', marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#021b36', borderRadius: 8, padding: 10, fontSize: 18, backgroundColor: '#e6ecf2', width: 220, color: '#222' },
  button: { borderRadius: 8, padding: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});