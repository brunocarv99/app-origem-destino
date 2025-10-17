import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import estadosCidades from "../../assets/estados-cidades.json";
import DropDownPicker from 'react-native-dropdown-picker';

const classesCaminhao = [
  { nome: "2C (2 eixos)", imagem: require("../../assets/images/2c.png") },
  { nome: "3C (3 eixos)", imagem: require("../../assets/images/3c.png") },
  { nome: "2S1 (3 eixos)", imagem: require("../../assets/images/2s1.png") },
  { nome: "4CD (4 eixos)", imagem: require("../../assets/images/4cd.png") },
  { nome: "2C2 (4 eixos)", imagem: require("../../assets/images/2c2.png") },
  { nome: "2S2 (4 eixos)", imagem: require("../../assets/images/2s2.png") },
  { nome: "2I2 (4 eixos)", imagem: require("../../assets/images/2i2.png") }, 
  { nome: "2C3 (5 eixos)", imagem: require("../../assets/images/2c3.png") },
  { nome: "3C2 (5 eixos)", imagem: require("../../assets/images/3c2.png") },
  { nome: "2S3 (5 eixos)", imagem: require("../../assets/images/2s3.png") },
  { nome: "3S2 (5 eixos)", imagem: require("../../assets/images/3s2.png") },
  { nome: "2I3 (5 eixos)", imagem: require("../../assets/images/2i3.png") },
  { nome: "3I2 (5 eixos)", imagem: require("../../assets/images/3i2.png") },
  { nome: "2J3 (5 eixos)", imagem: require("../../assets/images/2j3.png") },  
  { nome: "3C3 (6 eixos)", imagem: require("../../assets/images/3c3.png") },
  { nome: "3J3 (6 eixos)", imagem: require("../../assets/images/3j3.png") },
  { nome: "3I3 (6 eixos)", imagem: require("../../assets/images/3i3.png") },
  { nome: "3S3 (6 eixos)", imagem: require("../../assets/images/3s3.png") },
  { nome: "BITREM 3S2S2 (7 eixos)", imagem: require("../../assets/images/3s2s2.png") },
  { nome: "RODOTREM 3S2C4 (9 eixos)", imagem: require("../../assets/images/3s2c4.png") },
  { nome: "TRITREM 3S2S2S2 (9 eixos)", imagem: require("../../assets/images/3s2s2s2.png") },
  { nome: "3M6 (9 eixos)", imagem: require("../../assets/images/3m6.png") },

];
const frequencias = ["Diária", "Semanal", "Mensal", "Eventual"];
const rendas = [
  "Sem renda",
  "Até R$ 1.000,00",
  "Entre R$ 1.001,00 e R$ 4.000,00",
  "Entre R$ 4.001,00 e R$ 7.000,00",
  "Acima de R$ 7.000,00"
];
const motivosViagem = [
  "Residência",
  "Trabalho",
  "Escola",
  "Comércio",
  "Lazer/Turismo",
  "Outros (caso não seja possível enquadrar em outra opção)"
];
const mercadorias = [
  "Aço", "Adubos e fertilizantes", "Alimentos e bebidas", "Alumínio", "Asfalto e derivados",
  "Calcário, escória e carvão", "Carga inflamável", "Carga viva", "Combustíveis", "Ferragem",
  "Ferro gusa", "Frigorífico", "Café", "Feijão", "Milho", "Soja", "Outros grãos", "Laticínios",
  "Madeira", "Manganês", "Material de construção", "Material de limpeza", "Minério",
  "Móveis e eletrodomésticos", "Orgânicos", "Outros (caso não seja possível enquadrar em outra opção)",
  "Oxigênio", "Pedra e brita", "Veículos e peças", "Vestuário e calçados"
];
const eixosSuspensos = ["0", "1", "2", "3", "4", "5", "6", "7"];
const vazioOpcoes = ["Sim", "Não"];
const ufs = estadosCidades.estados.map(e => e.sigla);

function getCidadesPorUf(uf: string) {
  const estado = estadosCidades.estados.find((e: any) => e.sigla === uf);
  return estado ? estado.cidades : [];
}

const tiposVeiculo = [
  { nome: "Passeio", imagem: require("../../assets/images/passeio.png") },
  { nome: "Moto", imagem: require("../../assets/images/moto.png") },
  { nome: "Utilitario", imagem: require("../../assets/images/utilitario.png") },
];
const tiposOnibus = [
  { nome: "2CB Intermunicipal", valor: "2cb_int", imagem: require("../../assets/images/2cb_int.png") },
  { nome: "2CB Urbano", valor: "2cb_urb", imagem: require("../../assets/images/2cb_urb.png") },
  { nome: "3CB", valor: "3cb", imagem: require("../../assets/images/3cb.png") },
  { nome: "4DB", valor: "4db", imagem: require("../../assets/images/4db.png") },
];

const eixosPorClasse = {
  "2C (2 eixos)": ["0"],
  "3C (3 eixos)": ["0", "1"],
  "2S1 (3 eixos)": ["0", "1"],
  "2S2 (4 eixos)": ["0", "1", "2"],
  "4CD (4 eixos)": ["0", "1", "2"],
  "2C2 (4 eixos)": ["0", "1", "2"],
  "2C3 (5 eixos)": ["0", "1", "2", "3"],
  "2I2 (4 eixos)": ["0", "1", "2"],
  "2I3 (5 eixos)": ["0", "1", "2", "3"],
  "2S3 (5 eixos)": ["0", "1", "2", "3"],
  "2J3 (5 eixos)": ["0", "1", "2", "3"],
  "3S2 (5 eixos)": ["0", "1", "2", "3"],
  "3I2 (5 eixos)": ["0", "1", "2", "3"],
  "3C2 (5 eixos)": ["0", "1", "2", "3"],
  "3C3 (6 eixos)": ["0", "1", "2", "3", "4"],
  "3J3 (6 eixos)": ["0", "1", "2", "3", "4"],
  "3I3 (6 eixos)": ["0", "1", "2", "3", "4"],
  "3S3 (6 eixos)": ["0", "1", "2", "3", "4"],
  "BITREM 3S2S2": ["0", "1", "2", "3", "4", "5"],
  "RODOTREM 3S2C4": ["0", "1", "2", "3", "4", "5", "6", "7"],
  "TRITREM 3S2S2S2": ["0", "1", "2", "3", "4", "5", "6", "7"],
  "3M6": ["0", "1", "2", "3", "4", "5", "6", "7"],
};

// Limites por classe (em toneladas)
const limitesPorClasse = {
  "2C (2 eixos)": { pbt: [7, 27], capacidade: [3, 10] },
  "3C (3 eixos)": { pbt: [15, 35], capacidade: [10, 19] },
  "2S1 (3 eixos)": { pbt: [18, 38], capacidade: [10, 19] },
  "4CD (4 eixos)": { pbt: [21, 41], capacidade: [13, 21] },
  "2C2 (4 eixos)": { pbt: [28, 48], capacidade: [13, 32] },
  "2S2 (4 eixos)": { pbt: [25, 45], capacidade: [13, 32] },
  "2I2 (4 eixos)": { pbt: [28, 48], capacidade: [13, 32] },
  "2C3 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "3C2 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "2S3 (5 eixos)": { pbt: [29, 59], capacidade: [18, 42] },
  "3S2 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "2I3 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "3I2 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "2J3 (5 eixos)": { pbt: [31, 61], capacidade: [18, 42] },
  "3C3 (6 eixos)": { pbt: [38, 68], capacidade: [24, 47] },
  "3J3 (6 eixos)": { pbt: [38, 68], capacidade: [24, 47] },
  "3I3 (6 eixos)": { pbt: [41, 71], capacidade: [24, 47] },
  "3S3 (6 eixos)": { pbt: [36, 66], capacidade: [24, 47] },
  "BITREM 3S2S2 (7 eixos)": { pbt: [45, 75], capacidade: [25, 52] },
  "RODOTREM 3S2C4 (9 eixos)": { pbt: [45, 75], capacidade: [26, 70] },
  "TRITREM 3S2S2S2 (9 eixos)": { pbt: [63, 93], capacidade: [26, 70] },
  "3M6 (9 eixos)": { pbt: [63, 93], capacidade: [26, 70] },
};
function getLimitesTara(classe) {
  const { pbt, capacidade } = limitesPorClasse[classe] || {};
  if (!pbt || !capacidade) return [0, 0];
  const taraMin = pbt[0]; // Tara mínima = PBT mínimo (capacidade zero)
  const taraMax = pbt[1] - capacidade[0]; // Tara máxima = PBT máximo - Capacidade mínima
  return [taraMin, taraMax];
}

const maxOcupantesPorTipo = {
  Moto: 2,
  Passeio: 7,
  Utilitario: 20,
};

async function enviarPesquisaServidor(pesquisa) {
  try {
    const resposta = await fetch('https://backend-app-pgrx.onrender.com/pesquisas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pesquisa),
    });
    if (resposta.ok) {
      // Marcar como enviada no AsyncStorage
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      let pesquisas = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];
      pesquisas = pesquisas.map(p =>
        // Aqui compara por data e, se quiser, por outros campos únicos
        p.data === pesquisa.data ? { ...p, enviada: true } : p
      );
      await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
    } else {
      Alert.alert('Erro ao enviar pesquisa para o servidor');
    }
  } catch (e) {
    Alert.alert('Erro de conexão com o servidor');
  }
}

// Função para sincronizar pesquisas pendentes
async function sincronizarPesquisasPendentes() {
  const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
  const pesquisas = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];
  if (pesquisas.length === 0) return;

  let enviadas = [];
  for (const dados of pesquisas) {
    try {
      const resposta = await fetch('https://backend-app-pgrx.onrender.com/pesquisas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (resposta.ok) {
        enviadas.push(dados);
      }
    } catch (e) {
      // Se não conseguir enviar, mantém no array
    }
  }
  // Remove as pesquisas que foram enviadas com sucesso
  if (enviadas.length > 0) {
    const restantes = pesquisas.filter(p => !enviadas.includes(p));
    await AsyncStorage.setItem('pesquisas', JSON.stringify(restantes));
  }
}

export default function Pesquisa() {
  const { tipo } = useLocalSearchParams();
  const tipoParam = Array.isArray(tipo) ? tipo[0] : tipo;
  const [etapa, setEtapa] = useState(1);
  const router = useRouter();

  // Comuns
  const [origemUf, setOrigemUf] = useState(ufs[0]);
  const [origemCidade, setOrigemCidade] = useState("");
  const [origemBairro, setOrigemBairro] = useState("");
  const [destinoUf, setDestinoUf] = useState(ufs[0]);
  const [destinoCidade, setDestinoCidade] = useState("");
  const [destinoBairro, setDestinoBairro] = useState("");
  const [frequencia, setFrequencia] = useState(frequencias[0]);


  // Específicos caminhão
  const [classeCaminhao, setClasseCaminhao] = useState(classesCaminhao[0].nome);
  const [eixosSuspenso, setEixosSuspenso] = useState("0");
  const [mercadoria, setMercadoria] = useState(mercadorias[0]);
  const [pesoBruto, setPesoBruto] = useState("");
  const [tara, setTara] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [vazio, setVazio] = useState(vazioOpcoes[0]);

  // Específicos passeio/moto/utilitário
  const [tipoVeiculo, setTipoVeiculo] = useState(tiposVeiculo[0].nome);
  const [ocupacao, setOcupacao] = useState("1");
  const [tipoOnibus, setTipoOnibus] = useState(tiposOnibus[0].valor);

  // Comuns para ambos
  const [rendaFamiliar, setRendaFamiliar] = useState(rendas[0]);
  const [motivoViagem, setMotivoViagem] = useState(motivosViagem[0]);
  const [motivoViagemOutro, setMotivoViagemOutro] = useState("");
  const [mercadoriaOutro, setMercadoriaOutro] = useState(""); // só caminhão
  // Novo estado para controlar a exibição dos campos de bairro
  const [perguntarBairro, setPerguntarBairro] = useState(true);
  const [cidadeBuscaOrigem, setCidadeBuscaOrigem] = useState("");
  const [cidadeBuscaDestino, setCidadeBuscaDestino] = useState("");

  // Origem
  const [openOrigem, setOpenOrigem] = useState(false);
  const [cidadeOrigemValue, setCidadeOrigemValue] = useState(origemCidade);
  const [cidadesOrigemItems, setCidadesOrigemItems] = useState(
    getCidadesPorUf(origemUf).map(cidade => ({ label: cidade, value: cidade }))
  );

  // Destino
  const [openDestino, setOpenDestino] = useState(false);
  const [cidadeDestinoValue, setCidadeDestinoValue] = useState(destinoCidade);
  const [cidadesDestinoItems, setCidadesDestinoItems] = useState(
    getCidadesPorUf(destinoUf).map(cidade => ({ label: cidade, value: cidade }))
  );

  useEffect(() => {
    AsyncStorage.getItem("respostasFixas").then(str => {
      if (str) {
        const conf = JSON.parse(str);
        setPerguntarBairro(conf.perguntarBairro !== false); // padrão: true
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        sincronizarPesquisasPendentes();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCidadesOrigemItems(
      getCidadesPorUf(origemUf).map(cidade => ({ label: cidade, value: cidade }))
    );
    setCidadeOrigemValue("");
    setOrigemCidade("");
  }, [origemUf]);

  useEffect(() => {
    setCidadesDestinoItems(
      getCidadesPorUf(destinoUf).map(cidade => ({ label: cidade, value: cidade }))
    );
    setCidadeDestinoValue("");
    setDestinoCidade("");
  }, [destinoUf]);

  // Função para salvar pesquisa localmente
  const salvarPesquisaLocal = async (dadosComFixas) => {
    try {
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      const pesquisas = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];
      pesquisas.push(dadosComFixas);
      await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
      Alert.alert('Pesquisa salva localmente!');
    } catch (e) {
      Alert.alert('Erro ao salvar pesquisa');
    }
  };

  // FLUXO CAMINHÃO
  if (tipoParam === "caminhao" && etapa === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione a classe do caminhão</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {classesCaminhao.map((classe) => {
            const selecionado = classeCaminhao === classe.nome;
            return (
              <TouchableOpacity
                key={classe.nome}
                style={[
                  styles.tipoVeiculoButton,
                  selecionado ? styles.tipoVeiculoButtonSelecionado : null,
                  {
                    width: "96%",
                    alignSelf: "center",
                    marginVertical: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 8
                  }
                ]}
                onPress={() => {
                  setClasseCaminhao(classe.nome);
                  const novaChave = getChaveClasse(classe.nome);
                  const eixos = eixosPorClasse[novaChave] || ["0"];
                  setEixosSuspenso(eixos[0]);
                }}
              >
                <Text style={styles.tipoVeiculoTexto}>{classe.nome}</Text>
                {classe.imagem && (
                  <Image
                    source={classe.imagem}
                    style={{
                      width: 120,
                      height: 120,
                      resizeMode: "contain",
                      marginLeft: 8
                    }}
                  />
                )
                }
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Voltar"
              color="#072531a4"
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color="#021b36ff"
              onPress={() => setEtapa(2)}
            />
          </View>
        </View>
      </View>
    );
  }

  if (tipoParam === "caminhao" && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);
    const classeSelecionadaObj = classesCaminhao.find(c => c.nome === classeCaminhao);
    const chaveClasse = getChaveClasse(classeCaminhao);

    // ADICIONE ESTA LINHA:
    const classeLimites = limitesPorClasse[classeCaminhao];
    const [taraMin, taraMax] = getLimitesTara(classeCaminhao);

    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 48 }]}>
        <Text style={styles.title}>Pesquisa OD - Caminhão</Text>
        <Text style={styles.label}>Classe selecionada:</Text>
        <Text style={styles.tipoVeiculoSelecionado}>{classeCaminhao}</Text>
        {classeSelecionadaObj?.imagem && (
          <Image
            source={classeSelecionadaObj.imagem}
            style={{ width: 80, height: 80, resizeMode: "contain", marginLeft: 8 }}
          />
        )}

        <Text style={styles.label}>Origem - UF:</Text>
        <Picker
          selectedValue={origemUf}
          onValueChange={(uf) => {
            setOrigemUf(uf);
            setOrigemCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <DropDownPicker
          open={openOrigem}
          value={cidadeOrigemValue}
          items={cidadesOrigemItems}
          setOpen={setOpenOrigem}
          setValue={val => {
            setCidadeOrigemValue(val());
            setOrigemCidade(val());
          }}
          setItems={setCidadesOrigemItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={2000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Origem - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Origem - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={origemBairro}
              onChangeText={setOrigemBairro}
              placeholder="Digite o bairro de origem"
              placeholderTextColor="#222"
            />
          </>
        )}

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <DropDownPicker
          open={openDestino}
          value={cidadeDestinoValue}
          items={cidadesDestinoItems}
          setOpen={setOpenDestino}
          setValue={val => {
            setCidadeDestinoValue(val());
            setDestinoCidade(val());
          }}
          setItems={setCidadesDestinoItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={1000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Destino - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Destino - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={destinoBairro}
              onChangeText={setDestinoBairro}
              placeholder="Digite o bairro de destino"
              placeholderTextColor="#222"
            />
          </>
        )}

        <Text style={styles.label}>Frequência de viagem:</Text>
        <Picker
          selectedValue={frequencia}
          onValueChange={setFrequencia}
          style={styles.input}
        >
          {frequencias.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Quantidade de eixos suspenso (não toca a via):</Text>
        <Picker
          selectedValue={eixosSuspenso}
          onValueChange={setEixosSuspenso}
          style={styles.input}
        >
          {(eixosPorClasse[chaveClasse] || ["0"]).map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Mercadoria:</Text>
        <Picker
          selectedValue={mercadoria}
          onValueChange={setMercadoria}
          style={styles.input}
        >
          {mercadorias.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        {mercadoria.startsWith("Outros") && (
          <TextInput
            style={styles.input}
            value={mercadoriaOutro}
            onChangeText={setMercadoriaOutro}
            placeholder="Digite a mercadoria"
            placeholderTextColor="#222"
          />
        )}

        <Text style={styles.label}>Peso bruto (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={pesoBruto}
          onChangeText={setPesoBruto}
          placeholder={classeLimites ? `Limite: ${classeLimites.pbt[0]}–${classeLimites.pbt[1]} t` : ""}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Capacidade (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={capacidade}
          onChangeText={setCapacidade}
          placeholder={classeLimites ? `Limite: ${classeLimites.capacidade[0]}–${classeLimites.capacidade[1]} t` : ""}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Tara (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={tara}
          onChangeText={setTara}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Vazio:</Text>
        <Picker
          selectedValue={vazio}
          onValueChange={setVazio}
          style={styles.input}
        >
          {vazioOpcoes.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Renda familiar:</Text>
        <Picker
          selectedValue={rendaFamiliar}
          onValueChange={setRendaFamiliar}
          style={styles.input}
        >
          {rendas.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Motivo da viagem:</Text>
        <Picker
          selectedValue={motivoViagem}
          onValueChange={setMotivoViagem}
          style={styles.input}
        >
          {motivosViagem.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        {motivoViagem.startsWith("Outros") && (
          <TextInput
            style={styles.input}
            value={motivoViagemOutro}
            onChangeText={setMotivoViagemOutro}
            placeholder="Digite o motivo"
            placeholderTextColor="#222"
          />
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color="#072531a4" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color="#021b36ff"
              onPress={async () => {
                // Validação dos campos obrigatórios
                if (
                  !origemUf ||
                  !origemCidade ||
                  (perguntarBairro && !origemBairro.trim()) ||
                  !destinoUf ||
                  !destinoCidade ||
                  (perguntarBairro && !destinoBairro.trim()) ||
                  !frequencia ||
                  !eixosSuspenso ||
                  !mercadoria ||
                  (mercadoria.startsWith("Outros") && !mercadoriaOutro.trim()) ||
                  !pesoBruto ||
                  !capacidade ||
                  !vazio ||
                  !rendaFamiliar ||
                  !motivoViagem ||
                  (motivoViagem.startsWith("Outros") && !motivoViagemOutro.trim())
                ) {
                  Alert.alert("Preencha todas as perguntas obrigatórias!");
                  return;
                }

                // Limites por classe
                const classeLimites = limitesPorClasse[classeCaminhao];
                const [taraMin, taraMax] = getLimitesTara(classeCaminhao);

                if (!classeLimites) {
                  Alert.alert("Classe de caminhão inválida.");
                  return;
                }
                const [pbtMin, pbtMax] = classeLimites.pbt;
                const [capMin, capMax] = classeLimites.capacidade;

                const pbtNum = Number(pesoBruto);
                const capacidadeNum = Number(capacidade);
                const taraCalculada = pbtNum - capacidadeNum;

                if (isNaN(pbtNum) || isNaN(capacidadeNum)) {
                  Alert.alert("Preencha Peso Bruto e Capacidade com valores numéricos.");
                  return;
                }
                if (pbtNum < pbtMin || pbtNum > pbtMax) {
                  Alert.alert(`Peso Bruto fora dos limites para a classe selecionada (${pbtMin}–${pbtMax}t).`);
                  return;
                }
                if (capacidadeNum < capMin || capacidadeNum > capMax) {
                  Alert.alert(`Capacidade fora dos limites para a classe selecionada (${capMin}–${capMax}t).`);
                  return;
                }
               
                // Monta o objeto para salvar (tara sempre calculada)
                const dados = {
                  classeCaminhao,
                  origemUf,
                  origemCidade,
                  origemBairro,
                  destinoUf,
                  destinoCidade,
                  destinoBairro,
                  frequencia,
                  eixosSuspenso,
                  mercadoria: mercadoria.startsWith("Outros") ? mercadoriaOutro : mercadoria,
                  pesoBruto: pbtNum,
                  tara: taraCalculada,
                  capacidade: capacidadeNum,
                  vazio,
                  rendaFamiliar,
                  motivoViagem: motivoViagem.startsWith("Outros") ? motivoViagemOutro : motivoViagem,
                  data: new Date()
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date()
                };
                await salvarPesquisaLocal(dadosComFixas);
                enviarPesquisaServidor(dadosComFixas); // sem await!
                if (typeof window !== 'undefined') {
                  window.alert('Pesquisa Salva!');
                } else {
                  Alert.alert('Pesquisa Salva!');
                }
                router.replace('/');
              }}
            />
          </View>
        </View>
        </ScrollView>
      );
  }

  // FLUXO PASSEIO/MOTO/UTILITÁRIO
  if (["passeio", "moto", "utilitario"].includes(tipoParam) && etapa === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione o tipo de veículo</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {tiposVeiculo.map((tipoV) => {
            const selecionado = tipoVeiculo === tipoV.nome;
            return (
              <TouchableOpacity
                key={tipoV.nome}
                style={[
                  styles.tipoVeiculoButton,
                  selecionado ? styles.tipoVeiculoButtonSelecionado : null,
                  { width: "96%", alignSelf: "center", marginVertical: 4 }
                ]}
                onPress={() => setTipoVeiculo(tipoV.nome)}
              >
                <Image source={tipoV.imagem} style={styles.tipoVeiculoImagem} />
                <Text style={styles.tipoVeiculoTexto}>{tipoV.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Voltar"
              color="#072531a4"
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color="#021b36ff"
              onPress={() => setEtapa(2)}
            />
          </View>
        </View>
      </View>
    );
  }

  if (["passeio", "moto", "utilitario"].includes(tipoParam) && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);
    const maxOcupantes = maxOcupantesPorTipo[tipoVeiculo] || 7;
    const ocupantesOptions = Array.from({ length: maxOcupantes }, (_, i) => String(i + 1));
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 48 }]}>
        <Text style={styles.title}>Pesquisa OD - {tipoVeiculo}</Text>
        <Text style={styles.label}>Tipo de veículo selecionado:</Text>
        <Text style={styles.tipoVeiculoSelecionado}>{tipoVeiculo}</Text>

        <Text style={styles.label}>Origem - UF:</Text>
        <Picker
          selectedValue={origemUf}
          onValueChange={(uf) => {
            setOrigemUf(uf);
            setOrigemCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <DropDownPicker
          open={openOrigem}
          value={cidadeOrigemValue}
          items={cidadesOrigemItems}
          setOpen={setOpenOrigem}
          setValue={val => {
            setCidadeOrigemValue(val());
            setOrigemCidade(val());
          }}
          setItems={setCidadesOrigemItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={2000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Origem - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Origem - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={origemBairro}
              onChangeText={setOrigemBairro}
              placeholder="Digite o bairro de origem"
              placeholderTextColor="#222"
            />
          </>
        )}

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <DropDownPicker
          open={openDestino}
          value={cidadeDestinoValue}
          items={cidadesDestinoItems}
          setOpen={setOpenDestino}
          setValue={val => {
            setCidadeDestinoValue(val());
            setDestinoCidade(val());
          }}
          setItems={setCidadesDestinoItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={1000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Destino - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Destino - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={destinoBairro}
              onChangeText={setDestinoBairro}
              placeholder="Digite o bairro de destino"
              placeholderTextColor="#222"
            />
          </>
        )}

        <Text style={styles.label}>Ocupação (nº de ocupantes):</Text>
        <Picker
          selectedValue={ocupacao}
          onValueChange={setOcupacao}
          style={styles.input}
        >
          {ocupantesOptions.map((num) => (
            <Picker.Item key={num} label={num} value={num} />
          ))}
        </Picker>

        <Text style={styles.label}>Frequência de viagem:</Text>
        <Picker
          selectedValue={frequencia}
          onValueChange={setFrequencia}
          style={styles.input}
        >
          {frequencias.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Renda familiar:</Text>
        <Picker
          selectedValue={rendaFamiliar}
          onValueChange={setRendaFamiliar}
          style={styles.input}
        >
          {rendas.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Motivo da viagem:</Text>
        <Picker
          selectedValue={motivoViagem}
          onValueChange={setMotivoViagem}
          style={styles.input}
        >
          {motivosViagem.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        {motivoViagem.startsWith("Outros") && (
          <TextInput
            style={styles.input}
            value={motivoViagemOutro}
            onChangeText={setMotivoViagemOutro}
            placeholder="Digite o motivo"
            placeholderTextColor="#222"
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color="#072531a4" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color="#021b36ff"
              onPress={async () => {
                // Validação dos campos de bairro
                if (perguntarBairro) {
                  if (!origemBairro.trim() || !destinoBairro.trim()) {
                    Alert.alert("Preencha o bairro de origem e destino!");
                    return;
                  }
                }
                const dados = {
                  tipoVeiculo,
                  origemUf,
                  origemCidade,
                  origemBairro,
                  destinoUf,
                  destinoCidade,
                  destinoBairro,
                  ocupacao,
                  frequencia,
                  rendaFamiliar,
                  motivoViagem: motivoViagem.startsWith("Outros") ? motivoViagemOutro : motivoViagem,
                  data: new Date()
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date()
                };
                await salvarPesquisaLocal(dadosComFixas);
                enviarPesquisaServidor(dadosComFixas); // sem await!
                if (typeof window !== 'undefined') {
                  window.alert('Pesquisa Salva!');
                } else {
                  Alert.alert('Pesquisa Salva!');
                }
                router.replace('/');
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  // FLUXO ÔNIBUS
  if (tipoParam === "onibus" && etapa === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione o tipo de ônibus</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {tiposOnibus.map((tipo) => {
            const selecionado = tipoOnibus === tipo.valor;
            return (
              <TouchableOpacity
                key={tipo.valor}
                style={[
                  styles.tipoVeiculoButton,
                  selecionado ? styles.tipoVeiculoButtonSelecionado : null,
                  { width: "96%", alignSelf: "center", marginVertical: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8 }
                ]}
                onPress={() => setTipoOnibus(tipo.valor)}
              >
                <Text style={styles.tipoVeiculoTexto}>{tipo.nome}</Text>
                {tipo.imagem && (
                  <Image
                    source={tipo.imagem}
                    style={{ width: 120, height: 120, resizeMode: "contain", marginLeft: 8 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Voltar"
              color="#072531a4"
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color="#021b36ff"
              onPress={() => setEtapa(2)}
            />
          </View>
        </View>
      </View>
    );
  }

  if (tipoParam === "onibus" && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);

    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 48 }]}>
        <Text style={styles.title}>Pesquisa OD - Ônibus</Text>
        <Text style={styles.label}>Tipo de ônibus selecionado:</Text>
        <Text style={styles.tipoVeiculoSelecionado}>
          {tiposOnibus.find(t => t.valor === tipoOnibus)?.nome}
        </Text>

        <Text style={styles.label}>Origem - UF:</Text>
        <Picker
          selectedValue={origemUf}
          onValueChange={(uf) => {
            setOrigemUf(uf);
            setOrigemCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

                <Text style={styles.label}>Origem - Cidade:</Text>
        <DropDownPicker
          open={openOrigem}
          value={cidadeOrigemValue}
          items={cidadesOrigemItems}
          setOpen={setOpenOrigem}
          setValue={val => {
            setCidadeOrigemValue(val());
            setOrigemCidade(val());
          }}
          setItems={setCidadesOrigemItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={2000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Origem - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Origem - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={origemBairro}
              onChangeText={setOrigemBairro}
              placeholder="Digite o bairro de origem"
              placeholderTextColor="#222"
            />
          </>
        )}

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <DropDownPicker
          open={openDestino}
          value={cidadeDestinoValue}
          items={cidadesDestinoItems}
          setOpen={setOpenDestino}
          setValue={val => {
            setCidadeDestinoValue(val());
            setDestinoCidade(val());
          }}
          setItems={setCidadesDestinoItems}
          placeholder="Selecione a cidade"
          searchable={true}
          searchPlaceholder="Filtrar cidade..."
          style={styles.input}
          containerStyle={{ marginBottom: 16, width: '90%', alignSelf: 'center' }}
          zIndex={1000}
          textStyle={styles.dropDownText}
          labelStyle={styles.dropDownText}
        />

        {/* Destino - Bairro */}
        {perguntarBairro && (
          <>
            <Text style={styles.label}>Destino - Bairro:</Text>
            <TextInput
              style={styles.input}
              value={destinoBairro}
              onChangeText={setDestinoBairro}
              placeholder="Digite o bairro de destino"
              placeholderTextColor="#222" // <-- cor escura para dica
            />
          </>
        )}

        <Text style={styles.label}>Frequência de viagem:</Text>
        <Picker
          selectedValue={frequencia}
          onValueChange={setFrequencia}
          style={styles.input}
        >
          {frequencias.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color="#072531a4" />
          </View>
          <View style={{ flex: 1 }}>
                        <Button
              title="Salvar Pesquisa"
              color="#021b36ff"
              onPress={async () => {
                // Validação dos campos de bairro
                if (perguntarBairro) {
                  if (!origemBairro.trim() || !destinoBairro.trim()) {
                    Alert.alert("Preencha o bairro de origem e destino!");
                    return;
                  }
                }
                const dados = {
                  tipoOnibus,
                  origemUf,
                  origemCidade,
                  origemBairro,
                  destinoUf,
                  destinoCidade,
                  destinoBairro,
                  frequencia,
                  data: new Date()
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date()
                };
                await salvarPesquisaLocal(dadosComFixas);
                enviarPesquisaServidor(dadosComFixas); // sem await!
                if (typeof window !== 'undefined') {
                  window.alert('Pesquisa Salva!');
                } else {
                  Alert.alert('Pesquisa Salva!');
                }
                router.replace('/');
              }}
            />
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  // Fallback
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Em breve: formulário para {tipo}</Text>
    </View>
  );
}

const  styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26, // aumente aqui
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 20, // aumente aqui
    marginBottom: 4,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#021b36",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 22, // <-- aumente aqui (ex: 22 ou 24)
    backgroundColor: "#e6ecf2",
    width: "90%",
    minWidth: 200,
    maxWidth: 400,
    alignSelf: "center",
    color: "#222",
  },
  tipoVeiculoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  tipoVeiculoButton: {
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 4,
    backgroundColor: "#f9f9f9",
  },
  tipoVeiculoButtonSelecionado: {
    borderColor: "#021b36ff",
    backgroundColor: "#e0f0ff",
  },
  tipoVeiculoImagem: {
  width: 64,
  height: 64,
  marginBottom: 2,
  },
  tipoVeiculoTexto: {
    fontSize: 16, // maior
    fontWeight: "bold",
  },
  tipoVeiculoSelecionado: {
    fontSize: 18, // maior
    fontWeight: "bold",
    color: "#021b36ff",
    marginBottom: 12,
    alignSelf: "center",
  },
  dropDownText: {
    fontSize: 18, // ou maior, se preferir
    color: "#222",
  },
});

// Exemplo de função para salvar perguntas fixas
const salvarPerguntasFixas = async () => {
  const respostasFixas = {
    rodovia: rodovia,        // valor do campo rodovia
    posto: posto,            // valor do campo posto
    data: data,              // valor do campo data
    sentidoDe: sentidoDe,    // valor do campo sentidoDe
    sentidoPara: sentidoPara // valor do campo sentidoPara
  };
  await AsyncStorage.setItem('respostasFixas', JSON.stringify(respostasFixas));
  // Feedback para usuário, se quiser
};



// Adicione esta função utilitária:
function getChaveClasse(nomeClasse) {
  if (eixosPorClasse[nomeClasse]) return nomeClasse;
  const chave = Object.keys(eixosPorClasse).find((k) => nomeClasse.startsWith(k));
  return chave || Object.keys(eixosPorClasse)[0];
}