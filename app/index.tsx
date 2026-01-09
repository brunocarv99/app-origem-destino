import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSyncPesquisa } from "../hooks/useSyncPesquisa";
import { sincronizarPesquisasPendentes } from "./pesquisa/index";

export default function HomeScreen() {
  const [respostas, setRespostas] = useState([]);
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const router = useRouter();

  const visualizarRespostas = async () => {
    const pesquisasSalvas = await AsyncStorage.getItem("pesquisas");
    setRespostas(pesquisasSalvas ? JSON.parse(pesquisasSalvas) : []);
  };

  useEffect(() => {
    const fetchRespostas = async () => {
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      setRespostas(pesquisasSalvas ? JSON.parse(pesquisasSalvas) : []);
    };
    fetchRespostas();
  }, []);

  useSyncPesquisa();

  return (
    <View style={styles.container}>
      {/* Logo da Strata mais para cima */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>A serviço do DER/MG</Text>
          <Image
            source={require("../assets/images/logo-der.png")}
            style={styles.logoDer}
            resizeMode="contain"
          />
        </View>
      </View>
      {/* Conteúdo centralizado */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>PESQUISA ORIGEM-DESTINO</Text>
          {/* <Image
            source={require("../assets/images/origem-destino.png")}
            style={styles.titleImage}
            resizeMode="contain"
          /> */}
        </View>

        <Link
          href={{ pathname: "/pesquisa", params: { tipo: "passeio" } }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Iniciar pesquisa - Passeio</Text>
          </Pressable>
        </Link>
        <Link
          href={{ pathname: "/pesquisa", params: { tipo: "caminhao" } }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Iniciar pesquisa - Caminhão</Text>
          </Pressable>
        </Link>
        <Link
          href={{ pathname: "/pesquisa", params: { tipo: "onibus" } }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Iniciar pesquisa - Ônibus</Text>
          </Pressable>
        </Link>
        <Link href="/config" asChild>
          <Pressable
            style={{
              ...styles.button,
              backgroundColor: "#072531a4",
            }}
          >
            <Text style={styles.buttonText}>Configurar Pesquisa</Text>
          </Pressable>
        </Link>
        <Pressable
          style={{
            ...styles.button,
            backgroundColor: "#888",
          }}
          onPress={() => router.push('/banco')}
        >
          <Text style={styles.buttonText}>Visualizar Respostas Salvas</Text>
        </Pressable>
        <Pressable
          style={{
            ...styles.button,
            backgroundColor: "#191b19ff",
          }}
          onPress={async () => {
            await sincronizarPesquisasPendentes();
          }}
        >
          <Text style={styles.buttonText}>Sincronizar Pesquisas</Text>
        </Pressable>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  logoWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
  },
  logo: {
    width: 200,
    height: 200,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: -40, // Suba o bloco de pesquisa e botões
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, // Menos espaço entre DER e pesquisa
    marginTop: 0,
    width: "100%",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    marginRight: 2, // Reduza para aproximar do logo DER
    fontWeight: "bold",
  },
  logoDer: {
    width: 35, // Ajuste para um tamanho mais proporcional ao texto
    height: 35,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  titleImage: {
    width: 28,
    height: 28,
  },
  button: {
    backgroundColor: "#021b36ff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
    width: "90%",
    maxWidth: 320,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#666",
  },
});
