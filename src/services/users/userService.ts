import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../../utils/jwt";
import api from "../apiService";
import { UsuarioResponse } from "../../types/user";

export interface UserData {
  nome: string;
  email: string;
  senha: string;
}

export async function signUp(data: UserData) {
  const response = await api.post("/usuarios", data);
  return response.data;
}

export async function updateUser(data: Partial<UserData>, id: string) {
  const response = await api.put(`/usuarios/${id}`, data);

  return response.data;
}

export async function getLoggedUser(): Promise<UsuarioResponse> {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Token não encontrado no AsyncStorage");
    }

    // Decodificar o token para extrair o userId
    const decoded = decodeJwt(token);
    const userId = decoded.userId;

    try {
      // Fazer requisição com o ID do usuário
      const response = await api.get(`/usuarios/${userId}`);

      // Tratar diferentes formatos de resposta
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.user) {
        return response.data.user;
      } else if (Array.isArray(response.data)) {
        return response.data[0];
      } else {
        return response.data;
      }
    } catch (error: any) {
      throw new Error(
        `Erro ao obter dados do usuário: ${
          error.response?.data?.message ||
          error.response?.status ||
          error.message
        }`
      );
    }
  } catch (error: any) {
    throw error;
  }
}

export async function getAllUsers(): Promise<UsuarioResponse[]> {
  const response = await api.get("/usuarios");
  return response.data.data;
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<void> {
  await api.patch(`/usuarios/${userId}/status`, { isActive });
}

export interface UpdateUserDto {
  nome?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export async function updateUserById(
  userId: string,
  data: UpdateUserDto
): Promise<UsuarioResponse> {
  const response = await api.put(`/usuarios/${userId}`, data);
  return response.data.data || response.data;
}
