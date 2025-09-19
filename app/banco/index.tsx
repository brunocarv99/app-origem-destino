// app/banco/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Banco() {
  const [respostas, setRespostas] = useState([]);

  useEffect(() => {
    const fetchRespostas = async () => {
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      setRespostas(pesquisasSalvas ? JSON.parse(pesquisasSalvas) : []);
    };
    fetchRespostas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Respostas Salvas</Text>
      <ScrollView style={{ width: '100%' }}>
        {respostas.length === 0 ? (
          <Text style={styles.empty}>Nenhuma resposta salva.</Text>
        ) : (
          respostas.map((resp, idx) => (
            <View key={idx} style={styles.card}>
              {Object.entries(resp).map(([key, value]) => (
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
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: 'bold', marginRight: 6, color: '#021b36ff' },
  value: { flex: 1, color: '#333' },
  empty: { fontSize: 14, color: '#888', marginTop: 20 }
});

// Exemplo no botão Salvar Pesquisa
const dados = {
  // ...outros campos...
  data: new Date().toLocaleString() // mostra data e hora local
};