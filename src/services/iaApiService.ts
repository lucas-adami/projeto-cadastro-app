import { API_IA_URL, API_IA_KEY } from "@env";
import axios from "axios";

const baseURL = API_IA_URL;
const ApiKey = API_IA_KEY;

export const apiIA = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    API_KEY: ApiKey,
  },
});

apiIA.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Estrutura o erro para facilitar o uso com toast
    const customError = {
      ...error,
      userMessage: "Erro na comunicação com a IA",
    };

    if (
      error.response &&
      error.response.data &&
      error.response.data.detail === "Not authenticated"
    ) {
      console.error("Erro de autenticação na IA: Not authenticated");
      customError.userMessage = "Erro de autenticação na IA";
      
    } else if (error.response?.status === 500) {
      customError.userMessage = "Erro interno do servidor da IA";

    } else if (error.response?.status === 404) {
      customError.userMessage = "Serviço da IA não encontrado";

    } else if (!error.response) {
      customError.userMessage = "Erro de conexão com a IA";

    }

    return Promise.reject(customError);
  }
);
