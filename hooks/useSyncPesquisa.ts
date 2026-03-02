import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';

const API_URL = 'https://backend-app-pgrx.onrender.com/pesquisas';

export function useSyncPesquisa() {
  const syncInProgress = useRef(false);

  const syncPesquisas = async () => {
    if (syncInProgress.current) return;
    
    try {
      syncInProgress.current = true;
      const pesquisasSalvas = await AsyncStorage.getItem('pesquisas');
      
      if (pesquisasSalvas) {
        const pesquisas = JSON.parse(pesquisasSalvas);
        const naoEnviadas = pesquisas.filter(p => !p.enviada);
        
        for (const pesquisa of naoEnviadas) {
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(pesquisa)
            });

            if (!response.ok) {
              console.error('Falha ao enviar pesquisa. Status:', response.status);
              continue;
            }

            pesquisa.enviada = true;
          } catch (error) {
            console.error('Erro ao enviar pesquisa:', error);
          }
        }
        
        // Atualiza o storage com as flags atualizadas
        await AsyncStorage.setItem('pesquisas', JSON.stringify(pesquisas));
      }
    } finally {
      syncInProgress.current = false;
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPesquisas();
      }
    });

    return () => unsubscribe();
  }, []);

  return { syncPesquisas };
}

export default function HomeScreen() {
  useSyncPesquisa();
  // ...restante do componente...
}