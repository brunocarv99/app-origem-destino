// app/banco/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { FormCard } from '@/components/ui/FormCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { appTheme } from '@/theme/appTheme';

// Senha fixa igual à configuração
const SENHA_FIXA = "@trafego25";



export default function Banco({ requirePassword = true }: { requirePassword?: boolean }) {
  const [respostas, setRespostas] = useState([]);
  const [totalHoje, setTotalHoje] = useState(0);
  const [totalPasseio, setTotalPasseio] = useState(0);
  const [totalCaminhao, setTotalCaminhao] = useState(0);
  const [totalOnibus, setTotalOnibus] = useState(0);

  // Controle de senha
  const [acessoLiberado, setAcessoLiberado] = useState(!requirePassword);
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [showSenhaModal, setShowSenhaModal] = useState(requirePassword);
  const [erroSenha, setErroSenha] = useState("");

  useEffect(() => {
    setShowSenhaModal(requirePassword);
    setAcessoLiberado(!requirePassword);
    if (!requirePassword) {
      // carregar respostas automaticamente quando não exigir senha
      fetchLocais();
    }
  }, [requirePassword]);

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
        <View style={styles.modalOverlay}>
          <FormCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Digite a senha para acessar</Text>
            <TextInput
              style={[styles.input, { marginBottom: 12 }]}
              value={senhaDigitada}
              onChangeText={setSenhaDigitada}
              placeholder="Senha"
              secureTextEntry
              autoFocus
            />
            {erroSenha ? (
              <Text style={{ color: appTheme.colors.danger, marginBottom: 8 }}>{erroSenha}</Text>
            ) : null}
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
              <AppButton label="Entrar" onPress={validarSenha} style={styles.flexButton} />
              <AppButton
                label="Voltar"
                variant="secondary"
                style={styles.flexButton}
                onPress={() => {
                  setShowSenhaModal(false);
                  setSenhaDigitada("");
                  setErroSenha("");
                }}
              />
            </View>
          </FormCard>
        </View>
      </Modal>

      {/* Só mostra o conteúdo se o acesso estiver liberado */}
      {acessoLiberado && (
        <>
          <SectionTitle centered style={styles.pageTitle}>Respostas Salvas</SectionTitle>
          <Text style={styles.totalHoje}>
            Pesquisas respondidas hoje: {totalHoje}
          </Text>
          <Text style={styles.totalLinha}>
            Respostas Salvas para Passeio: {totalPasseio}
          </Text>
          <Text style={styles.totalLinha}>
            Respostas Salvas para Caminhões: {totalCaminhao}
          </Text>
          <Text style={[styles.totalLinha, { marginBottom: 16 }]}>
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
  container: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: appTheme.colors.background },
  pageTitle: { marginTop: appTheme.spacing.sm, color: appTheme.colors.text },
  total: { ...appTheme.typography.body, marginBottom: appTheme.spacing.sm, color: appTheme.colors.textMuted },
  totalHoje: { ...appTheme.typography.subtitle, marginBottom: appTheme.spacing.xs, color: appTheme.colors.text },
  totalLinha: { ...appTheme.typography.body, marginBottom: 4, color: appTheme.colors.textMuted },
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.md,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: 'bold', marginRight: 6, color: appTheme.colors.primary },
  value: { flex: 1, color: appTheme.colors.textMuted },
  empty: { fontSize: 14, color: appTheme.colors.textMuted, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: appTheme.radius.md,
    padding: 10,
    fontSize: 18,
    backgroundColor: appTheme.colors.surfaceSoft,
    width: 220,
    color: appTheme.colors.text,
  },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15,23,42,0.45)' },
  modalCard: {
    width: 320,
    maxWidth: "92%",
    alignItems: 'center',
  },
  modalTitle: { ...appTheme.typography.subtitle, marginBottom: appTheme.spacing.md, color: appTheme.colors.text },
  flexButton: { flex: 1 },
});
