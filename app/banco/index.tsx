// app/banco/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Banco() {
  const [respostas, setRespostas] = useState([]);
  const [totalHoje, setTotalHoje] = useState(0);
  const [totalPasseio, setTotalPasseio] = useState(0);
  const [totalCaminhao, setTotalCaminhao] = useState(0);
  const [totalOnibus, setTotalOnibus] = useState(0);

  useEffect(() => {
    const fetchLocais = async () => {
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
    };

    fetchLocais();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Respostas Salvas</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Pesquisas respondidas hoje: {totalHoje}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 4 }}>
        Respostas Salvas para Passeio: {totalPasseio}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 4 }}>
        Respostas Salvas para Caminhões: {totalCaminhao}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  total: { fontSize: 16, marginBottom: 12, color: '#333' },
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: 'bold', marginRight: 6, color: '#021b36ff' },
  value: { flex: 1, color: '#333' },
  empty: { fontSize: 14, color: '#888', marginTop: 20 }
});