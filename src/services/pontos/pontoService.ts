import api from "../apiService";
import {
  Ponto,
  CreatePontoDto,
  RegistrarEntradaDto,
  RegistrarSaidaDto,
} from "../../types/ponto";

export async function registrarEntrada(usuarioId: string): Promise<Ponto> {
  const response = await api.post("/pontos/entrada");
  // O backend retorna {data: ponto, success: true}
  return response.data.data || response.data;
}

export async function registrarSaida(pontoId: string): Promise<Ponto> {
  const response = await api.put(`/pontos/saida/${pontoId}`);
  return response.data.data || response.data;
}

export async function getPontoAberto(usuarioId: string): Promise<Ponto | null> {
  try {
    // Usa o endpoint correto que existe no backend
    const response = await api.get("/pontos/meu-ponto-aberto");
    // Se o backend retorna {data: null, success: true}, significa que não há ponto aberto
    if (response.data && response.data.data === null) {
      return null;
    }

    return response.data.data || response.data || null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // Não há ponto aberto
    }
    throw error;
  }
}

export async function getPontosByUser(usuarioId: string): Promise<Ponto[]> {
  try {
    // Usa o endpoint correto que existe no backend
    const response = await api.get("/pontos/meus-pontos");
    // O backend retorna {data: [...], success: true}
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return response.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return []; // Nenhum ponto encontrado
    }
    throw error;
  }
}

export async function getAllPontos(): Promise<Ponto[]> {
  const response = await api.get("/pontos");
  return response.data.data || [];
}

export async function createPonto(
  data: CreatePontoDto & { usuarioId: string }
): Promise<Ponto> {
  const response = await api.post("/pontos", data);
  return response.data.data;
}

export async function updatePonto(
  id: string,
  data: Partial<CreatePontoDto>
): Promise<Ponto> {
  const response = await api.put(`/pontos/${id}`, data);
  return response.data.data;
}

export async function deletePonto(id: string): Promise<void> {
  await api.delete(`/pontos/${id}`);
}

export async function getPontosByMonitor(monitorId: string): Promise<Ponto[]> {
  try {
    const response = await api.get(`/pontos/usuario/${monitorId}`);
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}
