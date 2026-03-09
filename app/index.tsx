import { Link } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { sincronizarPesquisasPendentes } from "./pesquisa/index";

export default function HomeScreen() {
  const [sincronizandoManual, setSincronizandoManual] = useState(false);

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
        <Link href="/admin" asChild>
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
            backgroundColor: "#191b19ff",
            opacity: sincronizandoManual ? 0.7 : 1,
          }}
          disabled={sincronizandoManual}
          onPress={async () => {
            if (sincronizandoManual) return;
            setSincronizandoManual(true);
            try {
              await sincronizarPesquisasPendentes();
            } finally {
              setSincronizandoManual(false);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {sincronizandoManual ? "Sincronizando..." : "Sincronizar Pesquisas"}
          </Text>
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
    marginTop: -40, 
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, 
    marginTop: 0,
    width: "100%",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    marginRight: 2, 
    fontWeight: "bold",
  },
  logoDer: {
    width: 35, 
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
