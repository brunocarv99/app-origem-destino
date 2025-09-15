import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import estadosCidades from "../../assets/estados-cidades.json";

const classesCaminhao = [
  { nome: "2C", imagem: require("../../assets/images/2c.png") },
  { nome: "3C", imagem: require("../../assets/images/3c.png") },
  { nome: "4CD", imagem: require("../../assets/images/4cd.png") },
  { nome: "2C2", imagem: require("../../assets/images/2c2.png") },
  { nome: "2C3", imagem: require("../../assets/images/2c3.png") },
  { nome: "3C2", imagem: require("../../assets/images/3c2.png") },
  { nome: "3C3", imagem: require("../../assets/images/3c3.png") },
  { nome: "BITREM 3S2S2", imagem: require("../../assets/images/3s2s2.png") },
  { nome: "RODOTREM 3S2C4", imagem: require("../../assets/images/3s2c4.png") },
  { nome: "TRITREM 3S2S2S2", imagem: require("../../assets/images/3s2s2s2.png") },
  { nome: "3M6", imagem: require("../../assets/images/3m6.png") },
  { nome: "2S1", imagem: require("../../assets/images/2s1.png") },
  { nome: "2S2", imagem: require("../../assets/images/2s2.png") },
  { nome: "2S3", imagem: require("../../assets/images/2s3.png") },
  { nome: "3S2", imagem: require("../../assets/images/3s2.png") },
  { nome: "3S3", imagem: require("../../assets/images/3s3.png") },
  { nome: "2I2", imagem: require("../../assets/images/2i2.png") },
  { nome: "2I3", imagem: require("../../assets/images/2i3.png") },
  { nome: "3I2", imagem: require("../../assets/images/3i2.png") },
  { nome: "3I3", imagem: require("../../assets/images/3i3.png") },
  { nome: "2J3", imagem: require("../../assets/images/2j3.png") },
  { nome: "3J3", imagem: require("../../assets/images/3j3.png") }
];
const frequencias = ["Diária", "Semanal", "Mensal", "Eventual"];
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

function getCidadesPorUf(uf) {
  const estado = estadosCidades.estados.find(e => e.sigla === uf);
  return estado ? estado.cidades : [];
}

const tiposVeiculo = [
  { nome: "Passeio", imagem: require("../../assets/images/passeio.png") },
  { nome: "Moto", imagem: require("../../assets/images/moto.png") },
  { nome: "Utilitario", imagem: require("../../assets/images/utilitario.png") },
];

export default function Pesquisa() {
  const { tipo } = useLocalSearchParams();
  const [etapa, setEtapa] = useState(1);

  // Comuns
  const [origemUf, setOrigemUf] = useState(ufs[0]);
  const [origemCidade, setOrigemCidade] = useState("");
  const [origemBairro, setOrigemBairro] = useState("");
  const [destinoUf, setDestinoUf] = useState(ufs[0]);
  const [destinoCidade, setDestinoCidade] = useState("");
  const [destinoBairro, setDestinoBairro] = useState("");
  const [frequencia, setFrequencia] = useState(frequencias[0]);

  // Específicos caminhão
  const [classeCaminhao, setClasseCaminhao] = useState(classesCaminhao[0]);
  const [eixosSuspenso, setEixosSuspenso] = useState("0");
  const [mercadoria, setMercadoria] = useState(mercadorias[0]);
  const [pesoBruto, setPesoBruto] = useState("");
  const [tara, setTara] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [vazio, setVazio] = useState(vazioOpcoes[0]);

  // Específicos passeio/moto/utilitário
  const [tipoVeiculo, setTipoVeiculo] = useState(tiposVeiculo[0].nome);
  const [ocupacao, setOcupacao] = useState("1");

  // FLUXO CAMINHÃO
  if (tipo === "caminhao" && etapa === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione a classe do caminhão</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {classesCaminhao.map((classe) => (
            <TouchableOpacity
              key={classe.nome}
              style={[
                styles.tipoVeiculoButton,
                classeCaminhao === classe.nome && styles.tipoVeiculoButtonSelecionado,
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
                    width: 56,
                    height: 56,
                    resizeMode: "contain",
                    marginLeft: 8
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button title="Avançar" onPress={() => setEtapa(2)} color="#021b36ff" />
      </View>
    );
  }

  if (tipo === "caminhao" && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", marginBottom: 8 }}>
          <Button title="Voltar" onPress={() => setEtapa(1)} color="#021b36ff" />
        </View>
        <Text style={styles.title}>Pesquisa OD - Caminhão</Text>
        <Text style={styles.label}>Classe selecionada:</Text>
        <Text style={styles.tipoVeiculoSelecionado}>{classeCaminhao}</Text>

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
          {eixosSuspensos.map((item) => (
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

        <Button
          title="Salvar Pesquisa"
          color="#021b36ff"
          onPress={() =>
            Alert.alert(
              "Pesquisa salva!",
              `Classe Caminhão: ${classeCaminhao}
Origem: ${origemCidade} - ${origemBairro} - ${origemUf}
Destino: ${destinoCidade} - ${destinoBairro} - ${destinoUf}
Frequência: ${frequencia}
Eixos suspenso: ${eixosSuspenso}
Mercadoria: ${mercadoria}
Peso bruto: ${pesoBruto}
Tara: ${tara}
Capacidade: ${capacidade}
Vazio: ${vazio}`
            )
          }
        />
      </ScrollView>
    );
  }

  // FLUXO PASSEIO/MOTO/UTILITÁRIO
  if (["passeio", "moto", "utilitario"].includes(tipo) && etapa === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione o tipo de veículo</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {tiposVeiculo.map((tipoV) => (
            <TouchableOpacity
              key={tipoV.nome}
              style={[
                styles.tipoVeiculoButton,
                tipoVeiculo === tipoV.nome && styles.tipoVeiculoButtonSelecionado,
                { width: "96%", alignSelf: "center", marginVertical: 4 }
              ]}
              onPress={() => setTipoVeiculo(tipoV.nome)}
            >
              <Image source={tipoV.imagem} style={styles.tipoVeiculoImagem} />
              <Text style={styles.tipoVeiculoTexto}>{tipoV.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button title="Avançar" onPress={() => setEtapa(2)} color="#021b36ff" />
      </View>
    );
  }

  if (["passeio", "moto", "utilitario"].includes(tipo) && etapa === 2) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", marginBottom: 8 }}>
          <Button title="Voltar" onPress={() => setEtapa(1)} color="#021b36ff" />
        </View>
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
          {[1,2,3,4,5,6,7].map((num) => (
            <Picker.Item key={num} label={String(num)} value={String(num)} />
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

        <Button
          title="Salvar Pesquisa"
          color="#021b36ff"
          onPress={() =>
            Alert.alert(
              "Pesquisa salva!",
              `Tipo: ${tipoVeiculo}
Origem: ${origemCidade} - ${origemBairro} - ${origemUf}
Destino: ${destinoCidade} - ${destinoBairro} - ${destinoUf}
Ocupação: ${ocupacao}
Frequência: ${frequencia}`
            )
          }
        />
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

const styles = StyleSheet.create({
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
    width: 32,
    height: 32,
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