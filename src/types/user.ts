export type IUser = {
  id?: string;
  nome: string;
  email: string;
};

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MONITOR";
  isActive: boolean;
  monitor?: {
    id: string;
    nome: string;
    tipo: string;
    cargaHorariaSemanal: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
