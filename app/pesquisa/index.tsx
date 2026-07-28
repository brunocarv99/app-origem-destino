import { appTheme } from "@/theme/appTheme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import estadosCidades from "../../assets/estados-cidades.json";

function removerAcentos(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizarBusca(str: string) {
  return removerAcentos((str || "").trim().toLocaleLowerCase());
}

function sanitizarDecimal(texto: string) {
  const sanitized = texto.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
}

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

const gruposEixoCaminhao = [
  { label: "2 eixos", value: 2 },
  { label: "3 eixos", value: 3 },
  { label: "4 eixos", value: 4 },
  { label: "5 eixos", value: 5 },
  { label: "6 eixos", value: 6 },
  { label: "7 eixos", value: 7 },
  { label: "9 eixos", value: 9 },
];
const frequencias = ["Diária", "Semanal", "Mensal", "Eventual"];
const rendas = [
  "Acima de R$ 7.000,00",
  "Entre R$ 4.001,00 e R$ 7.000,00",
  "Entre R$ 1.001,00 e R$ 4.000,00",
  "Até R$ 1.000,00",
  "Sem renda"
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
const carregadoOpcoes = ["Sim", "Não"];
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
  "2C (2 eixos)": { tara: [1, 20], pbt: [3, 26], capacidade: [1, 13] },
  "3C (3 eixos)": { tara: [1, 21], pbt: [13, 33], capacidade: [2, 22] },
  "2S1 (3 eixos)": { tara: [1.5, 21.5], pbt: [16, 36], capacidade: [4.5, 24.5] },
  "4CD (4 eixos)": { tara: [2, 22], pbt: [16, 36], capacidade: [4, 24] },
  "2C2 (4 eixos)": { tara: [5, 25], pbt: [28, 48], capacidade: [13, 33] },
  "2S2 (4 eixos)": { tara: [5, 25], pbt: [23, 43], capacidade: [8, 28] },
  "2I2 (4 eixos)": { tara: [5, 25], pbt: [26, 46], capacidade: [11, 31] },
  "2C3 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "3C2 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "2S3 (5 eixos)": { tara: [1, 27], pbt: [19, 69], capacidade: [8, 52] },
  "3S2 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "2I3 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "3I2 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "2J3 (5 eixos)": { tara: [3, 29], pbt: [21, 71], capacidade: [8, 52] },
  "3C3 (6 eixos)": { tara: [4, 31], pbt: [28, 78], capacidade: [14, 57] },
  "3J3 (6 eixos)": { tara: [4, 31], pbt: [28, 78], capacidade: [14, 57] },
  "3I3 (6 eixos)": { tara: [7, 34], pbt: [31, 81], capacidade: [14, 57] },
  "3S3 (6 eixos)": { tara: [2, 29], pbt: [26, 76], capacidade: [14, 57] },
  "BITREM 3S2S2 (7 eixos)": { tara: [10, 33], pbt: [35, 85], capacidade: [15, 62] },
  "RODOTREM 3S2C4 (9 eixos)": { tara: [9, 35], pbt: [35, 85], capacidade: [16, 80] },
  "TRITREM 3S2S2S2 (9 eixos)": { tara: [13, 47], pbt: [53, 103], capacidade: [16, 80] },
  "3M6 (9 eixos)": { tara: [13, 47], pbt: [53, 103], capacidade: [16, 80] },
};

const maxOcupantesPorTipo = {
  Moto: 2,
  Passeio: 7,
  Utilitario: 20,
};

type SyncResultado = {
  totalPendentes: number;
  enviados: number;
  falhas: number;
};

type SyncOpcoes = {
  forcarReenvio?: boolean;
};

const SYNC_ENDPOINT = 'https://backend-app-pgrx.onrender.com/pesquisas';
const SYNC_TIMEOUT_MS = 90000;
const SYNC_RESUMO_LIMITE = 220;

function resumirDetalheSync(valor: unknown) {
  if (valor === null || valor === undefined) {
    return '';
  }

  const texto =
    typeof valor === 'string'
      ? valor
      : JSON.stringify(valor);

  const textoLimpo = texto.replace(/\s+/g, ' ').trim();
  return textoLimpo.length > SYNC_RESUMO_LIMITE
    ? `${textoLimpo.slice(0, SYNC_RESUMO_LIMITE)}...`
    : textoLimpo;
}

function prepararPesquisaParaEnvio(pesquisa: any) {
  const {
    enviada,
    dataHoraSincronizacao,
    ultimaTentativaSincronizacao,
    ultimoErroSincronizacao,
    ultimoStatusSincronizacao,
    ...payload
  } = pesquisa;

  return payload;
}

function interpretarRespostaSync(status: number, corpoTexto: string) {
  let corpoJson: any = null;

  if (corpoTexto) {
    try {
      corpoJson = JSON.parse(corpoTexto);
    } catch {
      corpoJson = null;
    }
  }

  if (status < 200 || status >= 300) {
    return {
      sucesso: false,
      detalhe: resumirDetalheSync(corpoJson ?? corpoTexto) || `HTTP ${status}`,
      status,
    };
  }

  if (corpoJson && typeof corpoJson === 'object' && !Array.isArray(corpoJson)) {
    if ('success' in corpoJson && corpoJson.success === false) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.message ?? corpoJson),
        status,
      };
    }

    if ('ok' in corpoJson && corpoJson.ok === false) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.message ?? corpoJson),
        status,
      };
    }

    if ('acknowledged' in corpoJson && corpoJson.acknowledged === false) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.message ?? corpoJson),
        status,
      };
    }

    if ('insertedCount' in corpoJson && Number(corpoJson.insertedCount) === 0) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.message ?? corpoJson),
        status,
      };
    }

    if ('error' in corpoJson && corpoJson.error) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.error),
        status,
      };
    }

    if ('erro' in corpoJson && corpoJson.erro) {
      return {
        sucesso: false,
        detalhe: resumirDetalheSync(corpoJson.erro),
        status,
      };
    }
  }

  return {
    sucesso: true,
    detalhe: resumirDetalheSync(corpoJson ?? corpoTexto) || `HTTP ${status}`,
    status,
  };
}

// Função para sincronizar pesquisas pendentes
let sincronizacaoAtual: Promise<SyncResultado> | null = null;
async function sincronizarPesquisasPendentes(opcoes: SyncOpcoes = {}) {
  const forcarReenvio = opcoes.forcarReenvio === true;
  if (sincronizacaoAtual) {
    return sincronizacaoAtual;
  }
  sincronizacaoAtual = (async () => {
    const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
    let pesquisas = pesquisasSalvas ? JSON.parse(pesquisasSalvas) : [];
    const pendentes = forcarReenvio ? pesquisas : pesquisas.filter((p: any) => !p.enviada);

    if (pendentes.length === 0) {
      Alert.alert('Não há pesquisas pendentes para sincronizar.');
      return { totalPendentes: 0, enviados: 0, falhas: 0 };
    }

    let enviados = 0;
    let falhas = 0;
    const detalhesFalha: string[] = [];

    for (const pesquisa of pendentes) {
      const aindaPendente = forcarReenvio ? pesquisas.some((p: any) => p.id === pesquisa.id) : pesquisas.some((p: any) => p.id === pesquisa.id && !p.enviada);
      if (!aindaPendente) {
        continue;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
        let resposta;

        try {
          resposta = await fetch(SYNC_ENDPOINT, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(prepararPesquisaParaEnvio(pesquisa)),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        const corpoTexto = await resposta.text();
        const resultadoSync = interpretarRespostaSync(resposta.status, corpoTexto);

        if (!resultadoSync.sucesso) {
          falhas += 1;
          detalhesFalha.push(resultadoSync.detalhe || `HTTP ${resultadoSync.status}`);
          pesquisas = pesquisas.map((p: any) =>
            p.id === pesquisa.id
              ? {
                  ...p,
                  ultimaTentativaSincronizacao: getFormattedDateTime(),
                  ultimoErroSincronizacao: resultadoSync.detalhe || `HTTP ${resultadoSync.status}`,
                  ultimoStatusSincronizacao: resultadoSync.status,
                }
              : p
          );
          await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
          console.error('[SYNC] Falha ao enviar pesquisa', pesquisa.id, resultadoSync.status, resultadoSync.detalhe);
          continue;
        }

        enviados += 1;
        pesquisas = pesquisas.map((p: any) =>
          p.id === pesquisa.id
            ? {
                ...p,
                enviada: true,
                dataHoraSincronizacao: getFormattedDateTime(),
                ultimaTentativaSincronizacao: getFormattedDateTime(),
                ultimoErroSincronizacao: null,
                ultimoStatusSincronizacao: resultadoSync.status,
              }
            : p
        );
        await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
      } catch (e) {
        falhas += 1;
        const detalheErro = e instanceof Error ? e.message : String(e);
        detalhesFalha.push(detalheErro);
        pesquisas = pesquisas.map((p: any) =>
          p.id === pesquisa.id
            ? {
                ...p,
                ultimaTentativaSincronizacao: getFormattedDateTime(),
                ultimoErroSincronizacao: detalheErro,
              }
            : p
        );
        await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
        console.error('[SYNC] Erro ao enviar pesquisa', pesquisa.id, detalheErro);
      }
    }

    if (falhas === 0) {
      Alert.alert('Sincronização concluída', `${enviados} pesquisa(s) enviada(s).`);
    } else {
      const primeiraFalha = detalhesFalha[0] || 'Falha sem detalhe retornado.';
      Alert.alert(
        'Sincronização parcial',
        `${enviados} enviada(s) e ${falhas} pendente(s).\nPrimeira falha: ${primeiraFalha}`
      );
    }

    return { totalPendentes: pendentes.length, enviados, falhas };
  })();

  try {
    return await sincronizacaoAtual;
  } finally {
    sincronizacaoAtual = null;
  }
}

function getFormattedDateTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function Pesquisa() {
  const { tipo } = useLocalSearchParams();
  const tipoParam = Array.isArray(tipo) ? tipo[0] : tipo;
  const [etapa, setEtapa] = useState(1);
  const router = useRouter();
  const formularioScrollRef = useRef<ScrollView>(null);
  const motivoOutroEmFocoRef = useRef(false);
  const [motivoOutroEmFoco, setMotivoOutroEmFoco] = useState(false);
  const [alturaTeclado, setAlturaTeclado] = useState(0);

  const alterarFocoMotivoOutro = (emFoco: boolean) => {
    motivoOutroEmFocoRef.current = emFoco;
    setMotivoOutroEmFoco(emFoco);
  };

  // Comuns
  const [origemUf, setOrigemUf] = useState("");
  const [origemCidade, setOrigemCidade] = useState("");
  const [origemBairro, setOrigemBairro] = useState("");
  const [destinoUf, setDestinoUf] = useState("");
  const [destinoCidade, setDestinoCidade] = useState("");
  const [destinoBairro, setDestinoBairro] = useState("");
  const [frequencia, setFrequencia] = useState("");


  // Específicos caminhão
  const [grupoEixosCaminhao, setGrupoEixosCaminhao] = useState<number | null>(null);
  const [classeCaminhao, setClasseCaminhao] = useState("");
  const [eixosSuspenso, setEixosSuspenso] = useState("");
  const [mercadoria, setMercadoria] = useState("");
  const [pesoCarga, setPesoCarga] = useState("");
  const [tara, setTara] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [carregado, setCarregado] = useState("");

  // Específicos passeio/moto/utilitário
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [ocupacao, setOcupacao] = useState("");
  const [tipoOnibus, setTipoOnibus] = useState("");

  // Comuns para ambos
  const [rendaFamiliar, setRendaFamiliar] = useState("");
  const [motivoViagem, setMotivoViagem] = useState("");
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

  // Compatibilizadores para DropDownPicker: alguns lançam um callback, outros o valor diretamente.
  const handleSetCidadeOrigem = (v: any) => {
    const value = typeof v === 'function' ? v() : v;
    Keyboard.dismiss();
    setCidadeOrigemValue(value);
    setOrigemCidade(value);
    setCidadeBuscaOrigem(value);
    setOpenOrigem(false);
  };

  const handleSetCidadeDestino = (v: any) => {
    const value = typeof v === 'function' ? v() : v;
    Keyboard.dismiss();
    setCidadeDestinoValue(value);
    setDestinoCidade(value);
    setCidadeBuscaDestino(value);
    setOpenDestino(false);
  };

  // Abre sugestões imediatamente ao digitar se não houver uma seleção válida
  useEffect(() => {
    const shouldOpen = !!cidadeBuscaOrigem && cidadeBuscaOrigem !== origemCidade;
    setOpenOrigem(shouldOpen);
  }, [cidadeBuscaOrigem, origemCidade]);

  useEffect(() => {
    const shouldOpen = !!cidadeBuscaDestino && cidadeBuscaDestino !== destinoCidade;
    setOpenDestino(shouldOpen);
  }, [cidadeBuscaDestino, destinoCidade]);

  useEffect(() => {
    AsyncStorage.getItem("respostasFixas").then(str => {
      if (str) {
        const conf = JSON.parse(str);
        setPerguntarBairro(conf.perguntarBairro !== false); // padrão: true
      }
    });
  }, []);

  useEffect(() => {
    const tecladoAberto = Keyboard.addListener("keyboardDidShow", event => {
      if (!motivoOutroEmFocoRef.current) return;
      setAlturaTeclado(event.endCoordinates.height);
      setTimeout(() => formularioScrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const tecladoFechado = Keyboard.addListener("keyboardDidHide", () => {
      setAlturaTeclado(0);
    });

    return () => {
      tecladoAberto.remove();
      tecladoFechado.remove();
    };
  }, []);

  useEffect(() => {
    // Tenta sincronizar logo ao abrir o app
    // NetInfo.fetch().then(state => {
    //   if (state.isConnected && state.isInternetReachable) {
    //     sincronizarPesquisasPendentes();
    //   }
    // });

    // Continua ouvindo mudanças de conexão
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   if (state.isConnected && state.isInternetReachable) {
    //     sincronizarPesquisasPendentes();
    //   }
    // });
    // return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCidadesOrigemItems(
      getCidadesPorUf(origemUf).map(cidade => ({ label: cidade, value: cidade }))
    );
    setCidadeOrigemValue("");
    setOrigemCidade("");
    setCidadeBuscaOrigem("");
  }, [origemUf]);

  useEffect(() => {
    setCidadesDestinoItems(
      getCidadesPorUf(destinoUf).map(cidade => ({ label: cidade, value: cidade }))
    );
    setCidadeDestinoValue("");
    setDestinoCidade("");
    setCidadeBuscaDestino("");
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
        <Text style={styles.title}>Selecione o grupo por quantidade de eixos</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {gruposEixoCaminhao.map((grupo) => {
            const selecionado = grupoEixosCaminhao === grupo.value;
            return (
              <TouchableOpacity
                key={grupo.value}
                style={[
                  styles.tipoVeiculoButton,
                  selecionado ? styles.tipoVeiculoButtonSelecionado : null,
                  { width: "96%", alignSelf: "center", marginVertical: 4 }
                ]}
                onPress={() => {
                  setGrupoEixosCaminhao(grupo.value);
                  setClasseCaminhao("");
                  setEixosSuspenso("");
                }}
              >
                <Text style={styles.tipoVeiculoTexto}>{grupo.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Voltar"
              color={appTheme.colors.accent}
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color={appTheme.colors.primary}
              onPress={() => {
                if (!grupoEixosCaminhao) {
                  Alert.alert("Selecione a quantidade de eixos.");
                  return;
                }
                setEtapa(2);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (tipoParam === "caminhao" && etapa === 2) {
    const classesFiltradas = classesCaminhao.filter((classe) => getQtdEixosClasse(classe.nome) === grupoEixosCaminhao);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione a classe do caminhão</Text>
        <ScrollView style={{ width: "100%", maxHeight: 400 }}>
          {classesFiltradas.map((classe) => {
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
                  // Não pré-selecionar quantidade para que o picker mostre
                  // a opção "Selecione a quantidade" por padrão.
                  setEixosSuspenso("");
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
              color={appTheme.colors.accent}
              onPress={() => setEtapa(1)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color={appTheme.colors.primary}
              onPress={() => {
                if (!classeCaminhao) {
                  Alert.alert("Selecione a classe do caminhão.");
                  return;
                }
                setEtapa(3);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (tipoParam === "caminhao" && etapa === 3) {
    const cidadesOrigem = getCidadesPorUf(origemUf);
    const cidadesDestino = getCidadesPorUf(destinoUf);
    const classeSelecionadaObj = classesCaminhao.find(c => c.nome === classeCaminhao);
    const chaveClasse = getChaveClasse(classeCaminhao);

    // Limites e cálculo de capacidade dinamicamente exibida
    const classeLimites = limitesPorClasse[classeCaminhao];

    return (
      <ScrollView
        ref={formularioScrollRef}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 48 + (motivoOutroEmFoco ? alturaTeclado : 0) }
        ]}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
      >
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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !origemCidade && cidadeBuscaOrigem ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaOrigem}
          onChangeText={(text) => {
            setCidadeBuscaOrigem(text);
            if (text !== origemCidade) setOrigemCidade("");
          }}
          onFocus={() => setOpenOrigem(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade — selecione na lista"
          placeholderTextColor="#666"
        />
        {!origemCidade && cidadeBuscaOrigem && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesOrigemItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaOrigem))
            );
            return (
              openOrigem && cidadeBuscaOrigem ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeOrigem(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !destinoCidade && cidadeBuscaDestino ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaDestino}
          onChangeText={(text) => {
            setCidadeBuscaDestino(text);
            if (text !== destinoCidade) setDestinoCidade("");
          }}
          onFocus={() => setOpenDestino(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade — selecione na lista"
          placeholderTextColor="#666"
        />
        {!destinoCidade && cidadeBuscaDestino && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesDestinoItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaDestino))
            );
            return (
              openDestino && cidadeBuscaDestino ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeDestino(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a frequência" value="" />
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
          <Picker.Item label="Selecione a quantidade" value="" />
          {(eixosPorClasse[chaveClasse] || ["0"]).map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>


        <Text style={styles.label}>Veículo carregado?</Text>
        <Picker
          selectedValue={carregado}
          onValueChange={setCarregado}
          style={styles.input}
        >
          <Picker.Item label="Selecione" value="" />
          {carregadoOpcoes.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>Qual carga transportada (ou usualmente transportada)?</Text>
        <Picker
          selectedValue={mercadoria}
          onValueChange={setMercadoria}
          style={styles.input}
        >
          <Picker.Item label="Selecione a mercadoria" value="" />
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

        <Text style={styles.label}>Peso bruto do veículo em toneladas (Peso do veículo + capacidade):</Text>
        <TextInput
          style={styles.input}
          value={pesoBruto}
          onChangeText={(text) => setPesoBruto(sanitizarDecimal(text))}
          placeholder={classeLimites ? `Limite: ${classeLimites.pbt[0]}–${classeLimites.pbt[1]} t` : ""}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Tara em toneladas (tara do conjunto - veículo vazio):</Text>
        <TextInput
          style={styles.input}
          value={tara}
          onChangeText={(text) => setTara(sanitizarDecimal(text))}
          keyboardType="numeric"
          placeholder={classeLimites ? `Limite: ${classeLimites.tara[0]}–${classeLimites.tara[1]} t` : "Digite o peso da tara"}
          placeholderTextColor="#888"
        />

        {carregado === "Sim" && (
          <>
            <Text style={styles.label}>Peso da Carga em toneladas:</Text>
            <TextInput
              style={styles.input}
              value={pesoCarga}
              onChangeText={(text) => setPesoCarga(sanitizarDecimal(text))}
              editable={true}
              placeholder={classeLimites ? `Máximo: ${classeLimites.capacidade[1]} t` : 'Digite o peso da carga'}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </>
        )}

        <Text style={styles.label}>Renda familiar:</Text>
        <Picker
          selectedValue={rendaFamiliar}
          onValueChange={setRendaFamiliar}
          style={styles.input}
        >
          <Picker.Item label="Selecione a renda" value="" />
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
          <Picker.Item label="Selecione o motivo" value="" />
          {motivosViagem.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        {motivoViagem.startsWith("Outros") && (
          <TextInput
            style={styles.input}
            value={motivoViagemOutro}
            onChangeText={setMotivoViagemOutro}
            onFocus={() => alterarFocoMotivoOutro(true)}
            onBlur={() => alterarFocoMotivoOutro(false)}
            placeholder="Digite o motivo"
            placeholderTextColor="#222"
          />
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(2)} color={appTheme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color={appTheme.colors.primary}
              onPress={async () => {
                console.log('[DEBUG] Salvando pesquisa caminhão - campos:', {
                  classeCaminhao, origemUf, origemCidade, destinoUf, destinoCidade,
                  frequencia, eixosSuspenso, mercadoria, pesoCarga, pesoBruto, tara, carregado,
                });
                // Validação dos campos obrigatórios (todas as perguntas devem ser respondidas)
                const obrigatorios = [
                  origemUf,
                  origemCidade,
                  destinoUf,
                  destinoCidade,
                  frequencia,
                  eixosSuspenso,
                  mercadoria,
                  pesoBruto,
                  tara,
                  carregado,
                  rendaFamiliar,
                  motivoViagem
                ];
                if (carregado === "Sim") {
                  obrigatorios.push(pesoCarga);
                }
                if (perguntarBairro) {
                  obrigatorios.push(origemBairro, destinoBairro);
                }
                if (mercadoria.startsWith("Outros")) {
                  obrigatorios.push(mercadoriaOutro);
                }
                if (motivoViagem.startsWith("Outros")) {
                  obrigatorios.push(motivoViagemOutro);
                }
                const algumVazio = obrigatorios.some(v => !v || (typeof v === "string" && v.trim() === ""));
                if (algumVazio) {
                  Alert.alert("Preencha todas as perguntas obrigatórias!");
                  return;
                }

                // Verifica se o usuário realmente selecionou a cidade na lista
                if (!origemCidade) {
                  Alert.alert('Selecione uma cidade de Origem válida na lista (não apenas digitando).');
                  return;
                }
                if (!destinoCidade) {
                  Alert.alert('Selecione uma cidade de Destino válida na lista (não apenas digitando).');
                  return;
                }

                // Limites por classe
                const classeLimites = limitesPorClasse[classeCaminhao];

                if (!classeLimites) {
                  Alert.alert("Classe de caminhão inválida.");
                  return;
                }
                const [taraMin, taraMax] = classeLimites.tara;
                const [pbtMin, pbtMax] = classeLimites.pbt;
                const [, capacidadeMax] = classeLimites.capacidade;

                const pesoBrutoNum = Number(pesoBruto);
                const taraNum = Number(tara);
                const pesoCargaNum = carregado === "Sim" ? Number(pesoCarga) : null;

                if (isNaN(pesoBrutoNum) || isNaN(taraNum) || (carregado === "Sim" && (pesoCargaNum === null || isNaN(pesoCargaNum)))) {
                  Alert.alert("Preencha os campos numéricos obrigatórios com valores válidos.");
                  return;
                }

                if (carregado === "Sim" && pesoCargaNum !== null && pesoCargaNum >= pesoBrutoNum) {
                  Alert.alert(
                    "Peso da carga inválido",
                    "O peso da carga deve ser menor que o peso bruto do veículo. Digite novamente."
                  );
                  setPesoCarga("");
                  return;
                }

                if (pesoBrutoNum < pbtMin || pesoBrutoNum > pbtMax) {
                  Alert.alert(`Peso bruto fora dos limites para a classe selecionada (${pbtMin}–${pbtMax}t).`);
                  return;
                }

                if (taraNum < taraMin || taraNum > taraMax) {
                  Alert.alert(`Tara fora dos limites para a classe selecionada (${taraMin}–${taraMax}t).`);
                  return;
                }

                if (carregado === "Sim" && pesoCargaNum !== null && pesoCargaNum > capacidadeMax) {
                  Alert.alert(`Peso da carga acima do limite para a classe selecionada (máximo de ${capacidadeMax}t).`);
                  return;
                }
               
                // Monta o objeto para salvar (tara sempre calculada)
                const taraCalculada = tara ? Number(tara) : null;

                const dados = {
                  id: gerarUUID(),
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
                  pesoCarga: Number(pesoCarga),
                  tara: taraCalculada,
                  pesoBruto: pesoBrutoNum,
                  carregado,
                  rendaFamiliar,
                  motivoViagem: motivoViagem.startsWith("Outros") ? motivoViagemOutro : motivoViagem,
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime()
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime() // <-- NOVO CAMPO
                };
                try {
                  await salvarPesquisaLocal(dadosComFixas);
                  if (typeof window !== 'undefined') {
                    window.alert('Pesquisa Salva!');
                  } else {
                    Alert.alert('Pesquisa Salva!');
                  }
                  router.replace('/');
                } catch (err) {
                  console.error('[ERROR] salvarPesquisaLocal failed:', err);
                  Alert.alert('Erro ao salvar pesquisa (verifique console).');
                }
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
              color={appTheme.colors.accent}
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color={appTheme.colors.primary}
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
      <ScrollView
        ref={formularioScrollRef}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 48 + (motivoOutroEmFoco ? alturaTeclado : 0) }
        ]}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
      >
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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !origemCidade && cidadeBuscaOrigem ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaOrigem}
          onChangeText={(text) => {
            setCidadeBuscaOrigem(text);
            if (text !== origemCidade) setOrigemCidade("");
          }}
          onFocus={() => setOpenOrigem(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade (sem acento funciona) — selecione na lista"
          placeholderTextColor="#666"
        />
        {!origemCidade && cidadeBuscaOrigem && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesOrigemItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaOrigem))
            );
            return (
              openOrigem && cidadeBuscaOrigem ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeOrigem(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !destinoCidade && cidadeBuscaDestino ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaDestino}
          onChangeText={(text) => {
            setCidadeBuscaDestino(text);
            if (text !== destinoCidade) setDestinoCidade("");
          }}
          onFocus={() => setOpenDestino(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade (sem acento funciona) — selecione na lista"
          placeholderTextColor="#666"
        />
        {!destinoCidade && cidadeBuscaDestino && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesDestinoItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaDestino))
            );
            return (
              openDestino && cidadeBuscaDestino ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeDestino(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a ocupação" value="" />
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
          <Picker.Item label="Selecione a frequência" value="" />
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
          <Picker.Item label="Selecione a renda" value="" />
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
          <Picker.Item label="Selecione o motivo" value="" />
          {motivosViagem.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        {motivoViagem.startsWith("Outros") && (
          <TextInput
            style={styles.input}
            value={motivoViagemOutro}
            onChangeText={setMotivoViagemOutro}
            onFocus={() => alterarFocoMotivoOutro(true)}
            onBlur={() => alterarFocoMotivoOutro(false)}
            placeholder="Digite o motivo"
            placeholderTextColor="#222"
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color={appTheme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Salvar Pesquisa"
              color={appTheme.colors.primary}
              onPress={async () => {
                // Validação dos campos obrigatórios (todas as perguntas devem ser respondidas)
                const obrigatorios = [
                  tipoVeiculo,
                  origemUf,
                  origemCidade,
                  destinoUf,
                  destinoCidade,
                  ocupacao,
                  frequencia,
                  rendaFamiliar,
                  motivoViagem
                ];
                if (perguntarBairro) {
                  obrigatorios.push(origemBairro, destinoBairro);
                }
                if (motivoViagem.startsWith("Outros")) {
                  obrigatorios.push(motivoViagemOutro);
                }
                const algumVazio = obrigatorios.some(v => !v || (typeof v === "string" && v.trim() === ""));
                if (algumVazio) {
                  Alert.alert("Preencha todas as perguntas obrigatórias!");
                  return;
                }
                // Verifica se o usuário realmente selecionou a cidade na lista
                if (!origemCidade) {
                  Alert.alert('Selecione uma cidade de Origem válida na lista (não apenas digitando).');
                  return;
                }
                if (!destinoCidade) {
                  Alert.alert('Selecione uma cidade de Destino válida na lista (não apenas digitando).');
                  return;
                }
                // Verifica se o usuário realmente selecionou a cidade na lista
                if (!origemCidade) {
                  Alert.alert('Selecione uma cidade de Origem válida na lista (não apenas digitando).');
                  return;
                }
                if (!destinoCidade) {
                  Alert.alert('Selecione uma cidade de Destino válida na lista (não apenas digitando).');
                  return;
                }
                const dados = {
                  id: gerarUUID(),
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
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime() // <-- NOVO CAMPO
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime() // <-- NOVO CAMPO
                };
                await salvarPesquisaLocal(dadosComFixas);
               
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
          {/* Espaço reservado acima da lista de tipos de ônibus */}
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
              color={appTheme.colors.accent}
              onPress={() => router.back()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Avançar"
              color={appTheme.colors.primary}
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
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 48 }]} keyboardShouldPersistTaps="always" nestedScrollEnabled>
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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Origem - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !origemCidade && cidadeBuscaOrigem ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaOrigem}
          onChangeText={(text) => {
            setCidadeBuscaOrigem(text);
            if (text !== origemCidade) setOrigemCidade("");
          }}
          onFocus={() => setOpenOrigem(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade (sem acento funciona) — selecione na lista"
          placeholderTextColor="#666"
        />
        {!origemCidade && cidadeBuscaOrigem && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesOrigemItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaOrigem))
            );
            return (
              openOrigem && cidadeBuscaOrigem ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeOrigem(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a UF" value="" />
          {estadosCidades.estados.map((estado) => (
            <Picker.Item key={estado.sigla} label={estado.nome} value={estado.sigla} />
          ))}
        </Picker>

        <Text style={styles.label}>Destino - Cidade:</Text>
        <TextInput
          style={[
            styles.input,
            { marginBottom: 8 },
            !destinoCidade && cidadeBuscaDestino ? { borderColor: 'red', borderWidth: 2 } : {}
          ]}
          value={cidadeBuscaDestino}
          onChangeText={(text) => {
            setCidadeBuscaDestino(text);
            if (text !== destinoCidade) setDestinoCidade("");
          }}
          onFocus={() => setOpenDestino(true)}
          onBlur={() => {}}
          placeholder="Buscar cidade (sem acento funciona) — selecione na lista"
          placeholderTextColor="#666"
        />
        {!destinoCidade && cidadeBuscaDestino && (
          <Text style={styles.errorText}>Selecione uma cidade da lista</Text>
        )}
        {
          (() => {
            const filtered = cidadesDestinoItems.filter((it) =>
              normalizarBusca(it.label).includes(normalizarBusca(cidadeBuscaDestino))
            );
            return (
              openDestino && cidadeBuscaDestino ? (
                filtered.length > 0 ? (
                  <View style={styles.suggestionContainer}>
                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="always" nestedScrollEnabled>
                      {filtered.map((it) => (
                        <TouchableOpacity
                          key={it.value}
                          onPress={() => handleSetCidadeDestino(it.value)}
                          style={styles.suggestionItem}
                        >
                          <Text style={styles.suggestionText}>{it.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={[styles.suggestionContainer, { padding: 12 }]}> 
                    <Text style={{ color: '#666' }}>Nenhuma cidade encontrada</Text>
                  </View>
                )
              ) : null
            );
          })()
        }

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
          <Picker.Item label="Selecione a frequência" value="" />
          {frequencias.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24, marginBottom: 8, width: '100%' }}>
          <View style={{ flex: 1 }}>
            <Button title="Voltar" onPress={() => setEtapa(1)} color={appTheme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
                        <Button
              title="Salvar Pesquisa"
              color={appTheme.colors.primary}
              onPress={async () => {
                // Validação dos campos obrigatórios (todas as perguntas devem ser respondidas)
                const obrigatorios = [
                  tipoOnibus,
                  origemUf,
                  origemCidade,
                  destinoUf,
                  destinoCidade,
                  frequencia
                ];
                if (perguntarBairro) {
                  obrigatorios.push(origemBairro, destinoBairro);
                }
                const algumVazio = obrigatorios.some(v => !v || (typeof v === "string" && v.trim() === ""));
                if (algumVazio) {
                  Alert.alert("Preencha todas as perguntas obrigatórias!");
                  return;
                }
                const dados = {
                  id: gerarUUID(),
                  tipoOnibus,
                  origemUf,
                  origemCidade,
                  origemBairro,
                  destinoUf,
                  destinoCidade,
                  destinoBairro,
                  frequencia,
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime() // <-- NOVO CAMPO
                };
                // Monte o objeto completo com perguntas fixas
                const respostasFixasStr = await AsyncStorage.getItem('respostasFixas');
                const respostasFixas = respostasFixasStr ? JSON.parse(respostasFixasStr) : {};
                const { data, ...respostasFixasSemData } = respostasFixas;
                const dadosComFixas = {
                  ...dados,
                  ...respostasFixasSemData,
                  data: new Date(),
                  dataHoraResposta: getFormattedDateTime() // <-- NOVO CAMPO
                };
                await salvarPesquisaLocal(dadosComFixas);
                 // sem await!
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

  // Fallback
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Em breve: formulário para {tipo}</Text>
    </View>
  );
}

const  styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingVertical: appTheme.spacing.lg,
    paddingHorizontal: appTheme.spacing.lg,
    backgroundColor: appTheme.colors.surface,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: appTheme.radius.xl,
    borderWidth: 1,
    borderColor: "#E6EAF0",
    shadowColor: appTheme.colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  title: {
    ...appTheme.typography.title,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: appTheme.spacing.lg,
    textAlign: "center",
    color: appTheme.colors.primaryStrong,
  },
  label: {
    ...appTheme.typography.label,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: appTheme.spacing.xs,
    alignSelf: "flex-start",
    marginLeft: "5%",
    color: appTheme.colors.primaryStrong,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6DEE8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    ...appTheme.typography.body,
    backgroundColor: "#FFFFFF",
    width: "90%",
    minWidth: 200,
    maxWidth: 440,
    alignSelf: "center",
    color: appTheme.colors.text,
    minHeight: 52,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tipoVeiculoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  tipoVeiculoButton: {
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9E1EA",
    margin: 6,
    backgroundColor: "#FBFCFE",
    shadowColor: appTheme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  tipoVeiculoButtonSelecionado: {
    borderColor: appTheme.colors.primary,
    borderWidth: 2,
    backgroundColor: "#F3F7FB",
    shadowOpacity: 0.1,
  },
  tipoVeiculoImagem: {
  width: 64,
  height: 64,
  marginBottom: 2,
  },
  tipoVeiculoTexto: {
    ...appTheme.typography.label,
    color: appTheme.colors.primaryStrong,
    textAlign: "center",
  },
  tipoVeiculoSelecionado: {
    ...appTheme.typography.subtitle,
    color: appTheme.colors.primary,
    marginBottom: appTheme.spacing.md,
    alignSelf: "center",
    textAlign: "center",
  },
  dropDownText: {
    fontSize: 16,
    color: appTheme.colors.text,
  },
  suggestionContainer: {
    width: '90%',
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#D6DEE8",
    backgroundColor: "#FFFFFF",
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    backgroundColor: "#FFFFFF",
  },
  suggestionText: {
    ...appTheme.typography.body,
    color: appTheme.colors.text,
  },
  errorText: {
    color: appTheme.colors.danger,
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: '5%',
    fontWeight: '600',
  },
});

// Salva as perguntas fixas usando a configuração salva (mantendo a ordem solicitada)
const salvarPerguntasFixas = async () => {
  try {
    const configStr = await AsyncStorage.getItem('configuracao');
    const config = configStr ? JSON.parse(configStr) : {};
    const respostasFixas = {
      perguntarBairro: config.perguntarBairro ?? false,
      sentidoDe: config.sentidoDe ?? '',
      sentidoPara: config.sentidoPara ?? '',
      data: config.data ?? '',
      posto: config.posto ?? '',
      rodovia: config.rodovia ?? '',
      pesquisador: config.pesquisador ?? '',
      latitude: config.latitude !== undefined && config.latitude !== null && config.latitude !== '' ? Number(config.latitude) : '',
      longitude: config.longitude !== undefined && config.longitude !== null && config.longitude !== '' ? Number(config.longitude) : ''
    };
    await AsyncStorage.setItem('respostasFixas', JSON.stringify(respostasFixas));
  } catch (e) {
    console.error('Erro ao salvar perguntas fixas:', e);
  }
};



// Adicione esta função utilitária:
function getChaveClasse(nomeClasse) {
  if (eixosPorClasse[nomeClasse]) return nomeClasse;
  const chave = Object.keys(eixosPorClasse).find((k) => nomeClasse.startsWith(k));
  return chave || Object.keys(eixosPorClasse)[0];
}

function getQtdEixosClasse(nomeClasse: string) {
  const match = nomeClasse.match(/\((\d+)\s+eixos?\)/i);
  return match ? Number(match[1]) : null;
}

export { sincronizarPesquisasPendentes };

