import { Professor } from "../../types/professor";
import api from "../apiService";

export const postProfessor = async (data: Professor) => {
  const response = await api.post("/professores", data);

  return response.data;
};

export const getProfessors = async (filters?: {
  nome?: string;
  cursos?: string[];
  titulacoes?: string[];
}) => {
  const params: any = {};
  if (filters?.nome) params.nome = filters.nome;
  if (filters?.cursos && filters.cursos.length > 0)
    params.cursos = filters.cursos.join(",");
  if (filters?.titulacoes && filters.titulacoes.length > 0)
    params.titulacoes = filters.titulacoes.join(",");
  const response = await api.get("/professores", { params });
  //forma de como a lista de professores está vindo do backend
  //response.data.data
  //data = {message: professores encontrados com sucesso, data: []}
  return response.data.data;
};

export const deleteProfessor = async (id: string) => {
  const response = await api.delete(`/professores/${id}`);

  return response.data;
};

export const updateProfessor = async (id: string, data: Professor) => {
  const response = await api.put(`/professores/${id}`, data);

  return response.data;
};
