import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { FormCard } from "@/components/ui/FormCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { appTheme } from "@/theme/appTheme";

// Defina a senha fixa aqui
const SENHA_FIXA = "@trafego25";

function sanitizarDecimalComSinal(texto: string) {
  const sanitized = texto.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
  const semSinaisDuplicados = sanitized.replace(/(?!^)-/g, '');
  const parts = semSinaisDuplicados.split('.');
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : semSinaisDuplicados;
}

export default function ConfiguracaoScreen({ requirePassword = true }: { requirePassword?: boolean }) {
        // Função para salvar configuração
    async function salvarConfiguracao() {
      if (!pesquisador || !rodovia || !posto || !data || !sentidoDe || !sentidoPara || !latitude || !longitude) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }

      const latitudeNumero = Number(latitude);
      const longitudeNumero = Number(longitude);

      if (Number.isNaN(latitudeNumero) || Number.isNaN(longitudeNumero)) {
        Alert.alert('Erro', 'Latitude e longitude devem ser números válidos.');
        return;
      }

      const novaConfig = {
        pesquisador,
        rodovia,
        posto,
        data,
        sentidoDe,
        sentidoPara,
        latitude,
        longitude,
        perguntarBairro,
      };
      setConfigSalva(novaConfig);
      await AsyncStorage.setItem('configuracao', JSON.stringify(novaConfig));
      // Também salva respostasFixas para uso na pesquisa
      const respostasFixas = {
        perguntarBairro: novaConfig.perguntarBairro ?? false,
        sentidoDe: novaConfig.sentidoDe ?? '',
        sentidoPara: novaConfig.sentidoPara ?? '',
        data: novaConfig.data ?? '',
        posto: novaConfig.posto ?? '',
        rodovia: novaConfig.rodovia ?? '',
        pesquisador: novaConfig.pesquisador ?? '',
        latitude: latitudeNumero,
        longitude: longitudeNumero,
      };
      await AsyncStorage.setItem('respostasFixas', JSON.stringify(respostasFixas));
      setMostrandoNovaConfig(false);
      setShowResumo(true);
    }
    // Tipagem para configuração
    type ConfigType = {
      pesquisador: string;
      rodovia: string;
      posto: string;
      data: string;
      sentidoDe: string;
      sentidoPara: string;
      latitude: string;
      longitude: string;
      perguntarBairro: boolean;
    };
    // Estado para configuração salva
    const [configSalva, setConfigSalva] = useState<ConfigType | null>(null);
    const [showSenhaModal, setShowSenhaModal] = useState(requirePassword);
    const [senhaDigitada, setSenhaDigitada] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [acessoLiberado, setAcessoLiberado] = useState(!requirePassword);
    const [mostrandoNovaConfig, setMostrandoNovaConfig] = useState(false);
    // Estados do formulário de configuração
    const [pesquisador, setPesquisador] = useState("");
    const [rodovia, setRodovia] = useState("");
    const [posto, setPosto] = useState("");
    const [data, setData] = useState("");
    const [sentidoDe, setSentidoDe] = useState("");
    const [sentidoPara, setSentidoPara] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [perguntarBairro, setPerguntarBairro] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showResumo, setShowResumo] = useState(false);

    // Função para validar senha
    function validarSenha() {
      if (senhaDigitada === SENHA_FIXA) {
        setAcessoLiberado(true);
        setShowSenhaModal(false);
        setErroSenha("");
      } else {
        setErroSenha("Senha incorreta");
      }
    }

    // Efeito para carregar configuração salva ao iniciar
    useEffect(() => {
      async function carregarConfiguracao() {
        try {
          const configString = await AsyncStorage.getItem('configuracao');
          if (configString) {
            const config = JSON.parse(configString);
            setConfigSalva(config);
            setPesquisador(config.pesquisador);
            setRodovia(config.rodovia);
            setPosto(config.posto);
            setData(config.data);
            setSentidoDe(config.sentidoDe);
            setSentidoPara(config.sentidoPara);
            setLatitude(config.latitude ?? "");
            setLongitude(config.longitude ?? "");
            setPerguntarBairro(config.perguntarBairro);
          }
        } catch (error) {
          console.error('Erro ao carregar configuração:', error);
        }
      }

      carregarConfiguracao();
    }, []);

    // Efeito para salvar configuração sempre que configSalva mudar
    useEffect(() => {
      async function salvarConfiguracaoStorage() {
        if (configSalva) {
          try {
            await AsyncStorage.setItem('configuracao', JSON.stringify(configSalva));
          } catch (error) {
            console.error('Erro ao salvar configuração:', error);
          }
        }
      }

      salvarConfiguracaoStorage();
    }, [configSalva]);

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
            <FormCard style={modalStyles.card}>
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
                <Text style={{ color: appTheme.colors.danger, marginBottom: 8 }}>{erroSenha}</Text>
              ) : null}
              <View style={styles.row}>
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
          <ScrollView contentContainerStyle={styles.container}>
            {/* Se houver configuração salva e não estiver preenchendo nova, mostra resumo e botão */}
            {configSalva && !mostrandoNovaConfig ? (
              <FormCard style={styles.cardSpacing}>
                <SectionTitle centered>Configuração Salva</SectionTitle>
                <Text style={styles.label}>Pesquisador: <Text style={styles.value}>{configSalva.pesquisador}</Text></Text>
                <Text style={styles.label}>Rodovia: <Text style={styles.value}>{configSalva.rodovia}</Text></Text>
                <Text style={styles.label}>Posto: <Text style={styles.value}>{configSalva.posto}</Text></Text>
                <Text style={styles.label}>Data: <Text style={styles.value}>{configSalva.data}</Text></Text>
                <Text style={styles.label}>Sentido de: <Text style={styles.value}>{configSalva.sentidoDe}</Text></Text>
                <Text style={styles.label}>Sentido para: <Text style={styles.value}>{configSalva.sentidoPara}</Text></Text>
                <Text style={styles.label}>Latitude: <Text style={styles.value}>{configSalva.latitude}</Text></Text>
                <Text style={styles.label}>Longitude: <Text style={styles.value}>{configSalva.longitude}</Text></Text>
                <Text style={styles.label}>Perguntar bairro: <Text style={styles.value}>{configSalva.perguntarBairro ? 'Sim' : 'Não'}</Text></Text>
                <AppButton
                  label="Preencher nova configuração"
                  onPress={() => setMostrandoNovaConfig(true)}
                  style={{ marginTop: appTheme.spacing.md }}
                />
              </FormCard>
            ) : null}

            {/* Formulário de configuração (só mostra se não há config salva ou se clicou em nova) */}
            {(!configSalva || mostrandoNovaConfig) && (
              <FormCard>
                <SectionTitle centered>Configurar Pesquisa</SectionTitle>

                <Text style={styles.label}>Perguntar bairro de origem e destino?</Text>
                <View style={styles.rowSpace}>
                  <AppButton
                    label="Sim"
                    onPress={() => setPerguntarBairro(true)}
                    style={styles.flexButton}
                    variant={perguntarBairro ? "primary" : "secondary"}
                  />
                  <AppButton
                    label="Não"
                    onPress={() => setPerguntarBairro(false)}
                    style={styles.flexButton}
                    variant={!perguntarBairro ? "primary" : "secondary"}
                  />
                </View>

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

                <Text style={styles.label}>Data:</Text>
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

                <Text style={styles.label}>Posto:</Text>
                <TextInput
                  style={styles.input}
                  value={posto}
                  onChangeText={setPosto}
                  placeholder="Digite o posto"
                />
                <Text style={styles.label}>Rodovia:</Text>
                <TextInput
                  style={styles.input}
                  value={rodovia}
                  onChangeText={setRodovia}
                  placeholder="Digite a rodovia"
                />
                <Text style={styles.label}>Pesquisador:</Text>
                <TextInput
                  style={styles.input}
                  value={pesquisador}
                  onChangeText={setPesquisador}
                  placeholder="Nome do pesquisador"
                />

                <Text style={styles.label}>Latitude:</Text>
                <TextInput
                  style={styles.input}
                  value={latitude}
                  onChangeText={(text) => setLatitude(sanitizarDecimalComSinal(text))}
                  placeholder="Ex.: -19.9286"
                  keyboardType="numbers-and-punctuation"
                />
                <Text style={styles.label}>Longitude:</Text>
                <TextInput
                  style={styles.input}
                  value={longitude}
                  onChangeText={(text) => setLongitude(sanitizarDecimalComSinal(text))}
                  placeholder="Ex.: -43.9386"
                  keyboardType="numbers-and-punctuation"
                />

                <AppButton label="Salvar" onPress={salvarConfiguracao} />
                <AppButton
                  label="Voltar"
                  variant="secondary"
                  onPress={() => {
                    if (typeof window !== 'undefined' && window.history) {
                      window.history.back();
                    } else {
                      Alert.alert('Voltar', 'Função de voltar não disponível nesta plataforma.');
                    }
                  }}
                />
              </FormCard>
            )}

            {/* Modal de resumo */}
            <Modal
              visible={showResumo}
              transparent
              animationType="fade"
              onRequestClose={() => setShowResumo(false)}
            >
              <View style={modalStyles.overlay}>
                <FormCard style={modalStyles.card}>
                  <Text style={modalStyles.title}>Resumo da Configuração</Text>
                  <Text style={modalStyles.label}>
                    Perguntar bairro: <Text style={modalStyles.value}>{(configSalva?.perguntarBairro ?? perguntarBairro) ? 'Sim' : 'Não'}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Sentido de: <Text style={modalStyles.value}>{configSalva?.sentidoDe ?? sentidoDe}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Sentido para: <Text style={modalStyles.value}>{configSalva?.sentidoPara ?? sentidoPara}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Data: <Text style={modalStyles.value}>{configSalva?.data ?? data}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Posto: <Text style={modalStyles.value}>{configSalva?.posto ?? posto}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Rodovia: <Text style={modalStyles.value}>{configSalva?.rodovia ?? rodovia}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Pesquisador: <Text style={modalStyles.value}>{configSalva?.pesquisador ?? pesquisador}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Latitude: <Text style={modalStyles.value}>{configSalva?.latitude ?? latitude}</Text>
                  </Text>
                  <Text style={modalStyles.label}>
                    Longitude: <Text style={modalStyles.value}>{configSalva?.longitude ?? longitude}</Text>
                  </Text>
                  <View style={styles.row}>
                    <AppButton label="Alterar" variant="secondary" style={styles.flexButton} onPress={() => setShowResumo(false)} />
                    <AppButton label="Confirmar" style={styles.flexButton} onPress={() => setShowResumo(false)} />
                  </View>
                </FormCard>
              </View>
            </Modal>
          </ScrollView>
        )}
      </View>
    );
}

// Estilos para os modais
const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'stretch' as const,
  },
  title: {
    ...appTheme.typography.subtitle,
    marginBottom: appTheme.spacing.sm,
    textAlign: 'center' as const,
    color: appTheme.colors.text,
  },
  label: {
    ...appTheme.typography.label,
    marginTop: appTheme.spacing.xs,
    color: appTheme.colors.text,
  },
  value: {
    fontWeight: '400' as const,
    color: appTheme.colors.textMuted,
  },
};

// Estilos principais da tela
const styles = {
  container: {
    padding: appTheme.spacing.xl,
    paddingBottom: appTheme.spacing.xl,
    backgroundColor: appTheme.colors.background,
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    borderRadius: appTheme.radius.md,
    padding: appTheme.spacing.sm,
    marginBottom: appTheme.spacing.md,
    backgroundColor: appTheme.colors.surfaceSoft,
    ...appTheme.typography.body,
    color: appTheme.colors.text,
  },
  title: {
    ...appTheme.typography.subtitle,
    marginBottom: appTheme.spacing.md,
    textAlign: 'center' as const,
    color: appTheme.colors.text,
  },
  label: {
    ...appTheme.typography.label,
    marginBottom: 4,
    color: appTheme.colors.text,
  },
  value: {
    fontWeight: '400' as const,
    color: appTheme.colors.textMuted,
  },
  row: { flexDirection: "row", marginTop: appTheme.spacing.lg, gap: appTheme.spacing.sm },
  rowSpace: { flexDirection: "row", marginBottom: appTheme.spacing.md, gap: appTheme.spacing.xs },
  flexButton: { flex: 1 },
  cardSpacing: { marginBottom: appTheme.spacing.xl },
};
