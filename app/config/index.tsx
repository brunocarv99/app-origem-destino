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
  TouchableOpacity,
  View
} from "react-native";

// Defina a senha fixa aqui
const SENHA_FIXA = "@trafego25";

export default function ConfiguracaoScreen({ requirePassword = true }: { requirePassword?: boolean }) {
        // Função para salvar configuração
    function salvarConfiguracao() {
      if (!pesquisador || !rodovia || !posto || !data || !sentidoDe || !sentidoPara) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }
      const novaConfig = {
        pesquisador,
        rodovia,
        posto,
        data,
        sentidoDe,
        sentidoPara,
        perguntarBairro,
      };
      setConfigSalva(novaConfig);
      AsyncStorage.setItem('configuracao', JSON.stringify(novaConfig));
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
            {/* Se houver configuração salva e não estiver preenchendo nova, mostra resumo e botão */}
            {configSalva && !mostrandoNovaConfig ? (
              <View style={{ marginBottom: 32 }}>
                <Text style={styles.title}>Configuração Salva</Text>
                <Text style={styles.label}>Pesquisador: <Text style={styles.value}>{configSalva.pesquisador}</Text></Text>
                <Text style={styles.label}>Rodovia: <Text style={styles.value}>{configSalva.rodovia}</Text></Text>
                <Text style={styles.label}>Posto: <Text style={styles.value}>{configSalva.posto}</Text></Text>
                <Text style={styles.label}>Data: <Text style={styles.value}>{configSalva.data}</Text></Text>
                <Text style={styles.label}>Sentido de: <Text style={styles.value}>{configSalva.sentidoDe}</Text></Text>
                <Text style={styles.label}>Sentido para: <Text style={styles.value}>{configSalva.sentidoPara}</Text></Text>
                <Text style={styles.label}>Perguntar bairro: <Text style={styles.value}>{configSalva.perguntarBairro ? 'Sim' : 'Não'}</Text></Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#021b36ff', marginTop: 18 }]}
                  onPress={() => setMostrandoNovaConfig(true)}
                >
                  <Text style={styles.buttonText}>Preencher nova configuração</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Formulário de configuração (só mostra se não há config salva ou se clicou em nova) */}
            {(!configSalva || mostrandoNovaConfig) && (
              <>
                <Text style={styles.title}>Configurar Pesquisa</Text>

                <Text style={styles.label}>Perguntar bairro de origem e destino?</Text>
                <View style={{ flexDirection: "row", marginBottom: 16 }}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: perguntarBairro ? "#021b36ff" : "#888", marginRight: 8 },
                    ]}
                    onPress={() => setPerguntarBairro(true)}
                  >
                    <Text style={styles.buttonText}>Sim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: !perguntarBairro ? "#021b36ff" : "#888" },
                    ]}
                    onPress={() => setPerguntarBairro(false)}
                  >
                    <Text style={styles.buttonText}>Não</Text>
                  </TouchableOpacity>
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

                <Pressable
                  style={{ ...styles.button, backgroundColor: "#021b36ff" }}
                  onPress={salvarConfiguracao}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </Pressable>
                <Pressable
                  style={{ ...styles.button, backgroundColor: "#072531a4" }}
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
              </>
            )}

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

// Estilos para os modais
const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'stretch' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  label: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginTop: 8,
  },
  value: {
    fontWeight: '400' as const,
  },
};

// Estilos principais da tela
const styles = {
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 18,
    textAlign: 'center' as const,
  },
  label: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  value: {
    fontWeight: '400' as const,
  },
};