import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import estadosCidades from "../../assets/estados-cidades.json";

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
  "2C": ["0"],
  "3C": ["0", "1"],
  "2S1": ["0", "1"],
  "2S2": ["0", "1", "2"],
  "4CD": ["0", "1", "2"],
  "2C2": ["0", "1", "2"],
  "2I2": ["0", "1", "2"],
  "2C3": ["0", "1", "2", "3"],
  "2I3": ["0", "1", "2", "3"],
  "2S3": ["0", "1", "2", "3"],
  "2J3": ["0", "1", "2", "3"],
  "3S2": ["0", "1", "2", "3"],
  "3I2": ["0", "1", "2", "3"],
  "3C2": ["0", "1", "2", "3"],
  "3C3": ["0", "1", "2", "3", "4"],
  "3J3": ["0", "1", "2", "3", "4"],
  "3I3": ["0", "1", "2", "3", "4"],
  "3S3": ["0", "1", "2", "3", "4"],
  "BITREM 3S2S2": ["0", "1", "2", "3", "4", "5"],
  "RODOTREM 3S2C4": ["0", "1", "2", "3", "4", "5", "6", "7"],
  "TRITREM 3S2S2S2": ["0", "1", "2", "3", "4", "5", "6", "7"],
  "3M6": ["0", "1", "2", "3", "4", "5", "6", "7"],
};

const maxOcupantesPorTipo = {
  Moto: 2,
  Passeio: 7,
  Utilitario: 20,
};

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

  // Função para salvar pesquisa localmente
  const salvarPesquisaLocal = async (dados) => {
    try {
      // Recupera respostas fixas
      const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
      const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};

      // Espalha cada campo das respostas fixas no objeto salvo
      const dadosComFixas = {
        ...dados,
        rodovia: respostasFixas.rodovia || '',
        posto: respostasFixas.posto || '',
        data: respostasFixas.data || '',
        sentidoDe: respostasFixas.sentidoDe || '',
        sentidoPara: respostasFixas.sentidoPara || '',
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
                onPress={() => setClasseCaminhao(classe.nome)}
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

  if (tipoParam === "caminhao" && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);
    const classeSelecionadaObj = classesCaminhao.find(c => c.nome === classeCaminhao);
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <Picker
          selectedValue={origemCidade}
          onValueChange={setOrigemCidade}
          style={styles.input}
          enabled={!!origemUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesOrigem.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={origemBairro}
          onChangeText={setOrigemBairro}
          placeholder="Digite o bairro"
        />

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <Picker
          selectedValue={destinoCidade}
          onValueChange={setDestinoCidade}
          style={styles.input}
          enabled={!!destinoUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesDestino.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={destinoBairro}
          onChangeText={setDestinoBairro}
          placeholder="Digite o bairro"
        />

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
            {(eixosPorClasse[classeCaminhao] || ["0"]).map((item) => (
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

        <Text style={styles.label}>Peso bruto (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={pesoBruto}
          onChangeText={setPesoBruto}
          placeholder="Ex: 20"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Tara (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={tara}
          onChangeText={setTara}
          placeholder="Ex: 8"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Capacidade (toneladas):</Text>
        <TextInput
          style={styles.input}
          value={capacidade}
          onChangeText={setCapacidade}
          placeholder="Ex: 12"
          keyboardType="numeric"
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color="#072531a4" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color="#021b36ff"
              onPress={() => {
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
                  mercadoria,
                  pesoBruto,
                  tara,
                  capacidade,
                  vazio,
                  rendaFamiliar,
                  motivoViagem,
                  data: new Date().toLocaleString()
                };
                salvarPesquisaLocal(dados);
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
      <ScrollView contentContainerStyle={styles.container}>
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
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <Picker
          selectedValue={origemCidade}
          onValueChange={setOrigemCidade}
          style={styles.input}
          enabled={!!origemUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesOrigem.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={origemBairro}
          onChangeText={setOrigemBairro}
          placeholder="Digite o bairro"
        />

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <Picker
          selectedValue={destinoCidade}
          onValueChange={setDestinoCidade}
          style={styles.input}
          enabled={!!destinoUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesDestino.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={destinoBairro}
          onChangeText={setDestinoBairro}
          placeholder="Digite o bairro"
        />

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

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color="#072531a4" />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color="#021b36ff"
              onPress={() => {
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
                  motivoViagem,
                  data: new Date().toLocaleString()
                };
                salvarPesquisaLocal(dados);
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
      <ScrollView contentContainerStyle={styles.container}>
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
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <Picker
          selectedValue={origemCidade}
          onValueChange={setOrigemCidade}
          style={styles.input}
          enabled={!!origemUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesOrigem.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={origemBairro}
          onChangeText={setOrigemBairro}
          placeholder="Digite o bairro"
        />

        <Text style={styles.label}>Destino - UF:</Text>
        <Picker
          selectedValue={destinoUf}
          onValueChange={(uf) => {
            setDestinoUf(uf);
            setDestinoCidade("");
          }}
          style={styles.input}
        >
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <Picker
          selectedValue={destinoCidade}
          onValueChange={setDestinoCidade}
          style={styles.input}
          enabled={!!destinoUf}
        >
          <Picker.Item label="Selecione a cidade" value="" />
          {cidadesDestino.map((cidade) => (
            <Picker.Item key={cidade} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Bairro:</Text>
        <TextInput
          style={styles.input}
          value={destinoBairro}
          onChangeText={setDestinoBairro}
          placeholder="Digite o bairro"
        />

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
              onPress={() => {
                const dados = {
                  tipoOnibus,
                  origemUf,
                  origemCidade,
                  origemBairro,
                  destinoUf,
                  destinoCidade,
                  destinoBairro,
                  frequencia,
                  data: new Date().toLocaleString()
                };
                salvarPesquisaLocal(dados);
                if (typeof window !== 'undefined') {
                  window.alert('Pesquisa Salva!');
                } else {
                  Alert.alert('Pesquisa Salva!');
                }
                router.replace('/'); // retorna à tela inicial
              }}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    width: "90%",
    minWidth: 200,
    maxWidth: 400,
    alignSelf: "center",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  tipoVeiculoSelecionado: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#021b36ff",
    marginBottom: 10,
    alignSelf: "center",
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