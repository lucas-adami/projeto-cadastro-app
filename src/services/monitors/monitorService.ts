import api from "../apiService";
import { CreateMonitorDto, MonitorResponse } from "../../types/monitor";

export async function createMonitor(
  data: CreateMonitorDto
): Promise<MonitorResponse> {
  const response = await api.post("/monitores", data);
  return response.data;
}

export async function getAllMonitors(): Promise<MonitorResponse[]> {
  const response = await api.get("/monitores");
  // A API retorna {data: [...], pagination: {...}, success: true}
  // Então precisamos acessar response.data.data para pegar o array de monitores
  return response.data.data || [];
}

export async function getMonitorById(id: string): Promise<MonitorResponse> {
  const response = await api.get(`/monitores/${id}`);
  return response.data;
}

export async function updateMonitor(
  id: string,
  data: Partial<CreateMonitorDto>
): Promise<MonitorResponse> {
  const response = await api.put(`/monitores/${id}`, data);
  return response.data;
}

export async function deleteMonitor(id: string): Promise<void> {
  await api.delete(`/monitores/${id}`);
}

export async function getMonitorsByProfessorId(
  professorId: string
): Promise<MonitorResponse[]> {
  const response = await api.get(`/monitores/professor/${professorId}`);
  return response.data;
}
