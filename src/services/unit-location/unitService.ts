import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserLocation } from './locationService';
import { UnidadeSugerida } from '../../types/unit';
import api from '../apiService';

const STORAGE_KEY = '@unidade_sugerida';
const LAST_UPDATE_KEY = '@unidade_sugerida_last_update';
const INTERVALO_ATUALIZACAO_MS = 180000;

export async function buscarOuCacheUnidadeProxima(): Promise<{ id: string; nome: string } | null> {
  try {
    const [cache, lastUpdateStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(LAST_UPDATE_KEY),
    ]);

    const now = Date.now();
    const lastUpdate = lastUpdateStr ? parseInt(lastUpdateStr, 10) : 0;

    if (cache && now - lastUpdate < INTERVALO_ATUALIZACAO_MS) {
      const unidadeSalva: UnidadeSugerida = JSON.parse(cache);
      return { id: unidadeSalva.id, nome: unidadeSalva.nome };
    }

    const { latitude, longitude } = await getUserLocation();
    const response = await api.post('/unidades', { latitude, longitude });

    if (response.data && response.data.sucesso && response.data.dados) {
      const unidade: UnidadeSugerida = {
        ...response.data.dados,
        timestamp: now,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(unidade));
      await AsyncStorage.setItem(LAST_UPDATE_KEY, now.toString());
      return { id: unidade.id, nome: unidade.nome };
    }

    return null;
  } catch (err) {
    return null;
  }
}