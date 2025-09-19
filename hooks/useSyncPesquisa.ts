import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

const API_URL = 'http://localhost:3001/pesquisas'; // ajuste para o IP do backend se necessário

export function useSyncPesquisa() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        try {
          const pesquisas = await AsyncStorage.getItem('pesquisas');
          if (pesquisas) {
            const lista = JSON.parse(pesquisas);
            for (const pesquisa of lista) {
              // Envia cada pesquisa para o backend
              await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pesquisa),
              });
            }
            // Limpa pesquisas locais após sincronizar
            await AsyncStorage.removeItem('pesquisas');
          }
        } catch (err) {
          console.log('Erro ao sincronizar:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);
}

export default function HomeScreen() {
  useSyncPesquisa();
  // ...restante do componente...
}