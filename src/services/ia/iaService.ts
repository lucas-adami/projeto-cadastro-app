import { apiIA } from "..//iaApiService";

export async function gerarProfessorIA() {
  const response = await apiIA.post("/predict/full");
  return response.data;
}

export async function sugerirProfessorIA(partial: Record<string, any>) {
  const response = await apiIA.post("/predict/partial", partial);
  return response.data;
}