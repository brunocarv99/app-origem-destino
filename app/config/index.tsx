import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";

export default function ConfiguracaoScreen() {
  const [rodovia, setRodovia] = useState("");
  const [posto, setPosto] = useState("");
  const [data, setData] = useState("");
  const [sentidoDe, setSentidoDe] = useState("");
  const [sentidoPara, setSentidoPara] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  async function salvarConfiguracao() {
    try {
      await AsyncStorage.setItem(
        "configuracaoPesquisa",
        JSON.stringify({ rodovia, posto, data, sentidoDe, sentidoPara })
      );
      Alert.alert("Sucesso", "Configuração salva com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a configuração.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurar Pesquisa</Text>

      <Text style={styles.label}>Rodovia:</Text>
      <TextInput
        style={styles.input}
        value={rodovia}
        onChangeText={setRodovia}
        placeholder="Digite a rodovia"
      />

      <Text style={styles.label}>Posto:</Text>
      <TextInput
        style={styles.input}
        value={posto}
        onChangeText={setPosto}
        placeholder="Digite o posto"
      />

      <Text style={styles.label}>Data:</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          style={{
            ...styles.input,
            padding: 8,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 16,
            backgroundColor: "#f9f9f9",
          }}
          value={
            data
              ? `${data.split("/")[2]}-${data.split("/")[1].padStart(2, "0")}-${data
                  .split("/")[0]
                  .padStart(2, "0")}`
              : ""
          }
          onChange={e => {
            const [year, month, day] = e.target.value.split("-");
            setData(`${day}/${month}/${year}`);
          }}
        />
      ) : (
        <>
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
        </>
      )}

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

      <Pressable
        style={{
          ...styles.button,
          backgroundColor: "#021b36ff", // cor verde, troque se quiser outra cor
        }}
        onPress={salvarConfiguracao}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>

      <Link href="/config" asChild>
        <Pressable
          style={{
            ...styles.button,
            backgroundColor: "#e9cb21f8",
          }}
        >
          <Text style={styles.buttonText}>Configurar Pesquisa</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});