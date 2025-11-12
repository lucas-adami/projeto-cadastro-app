export interface Ponto {
  id: string;
  usuarioId: string;
  entrada: string; // ISO string
  saida?: string; // ISO string
  createdAt: string;
  updatedAt: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface CreatePontoDto {
  usuarioId: string;
  entrada: string;
  saida?: string;
}

export interface RegistrarEntradaDto {
  usuarioId: string;
}

export interface RegistrarSaidaDto {
  pontoId: string;
}

export interface PontoResponse {
  success: boolean;
  data: Ponto;
  message?: string;
}

export interface PontosListResponse {
  success: boolean;
  data: Ponto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
