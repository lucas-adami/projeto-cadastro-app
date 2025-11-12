export interface Monitor {
  id: string;
  nome: string;
  email: string;
  cargaHorariaSemanal: number; // em horas
  tipo: TipoMonitor;
  nomePesquisaMonitoria: string;
  professorId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TipoMonitor {
  MONITOR = "MONITOR",
  PESQUISADOR = "PESQUISADOR",
}

export interface HorarioTrabalho {
  id: string;
  diaSemana: DiaSemana;
  horaInicio: string; // formato HH:mm
  horaFim: string; // formato HH:mm
  horasTrabalho: number;
  monitorId: string;
  createdAt: string;
  updatedAt: string;
}

export enum DiaSemana {
  SEGUNDA = "SEGUNDA",
  TERCA = "TERCA",
  QUARTA = "QUARTA",
  QUINTA = "QUINTA",
  SEXTA = "SEXTA",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO",
}

export interface CreateMonitorDto {
  nome: string;
  email: string;
  cargaHorariaSemanal: number;
  tipo: TipoMonitor;
  nomePesquisaMonitoria: string;
  professorId: string;
  horarios: CreateHorarioTrabalhoDto[];
}

export interface CreateHorarioTrabalhoDto {
  diaSemana: DiaSemana;
  horasTrabalho: number;
}

export interface MonitorResponse extends Monitor {
  professor: {
    id: string;
    nome: string;
    email: string;
  };
  horarios: HorarioTrabalho[];
  usuario?: {
    id: string;
    nome: string;
    email: string;
    isActive: boolean;
  };
}
