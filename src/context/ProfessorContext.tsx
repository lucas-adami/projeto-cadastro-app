"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Professor } from "../types/professor";
import { getProfessors } from "../services/professors/professorService";
import { useToast } from "../utils/useToast";

type ProfessorContextType = {
  professors: Professor[];
  loading: boolean;
  refreshProfessorsData: () => void;
  getProfessorById: (id: string) => Professor | undefined;
};

export const ProfessorContext = createContext<ProfessorContextType | undefined>(
  undefined
);

export const ProfessorProvider = ({ children }: { children: ReactNode }) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchData = useCallback(
    async (filters?: {
      nome?: string;
      cursos?: string[];
      titulacoes?: string[];
    }) => {
      try {
        const professoresData = await getProfessors(filters);

        setProfessors(professoresData);
      } catch (error: any) {
        const msg = error.response?.data?.mensagem;

        showError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDataById = (id: string): Professor | undefined => {
    return professors.find((professor) => professor.id === id);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ProfessorContext.Provider
      value={{
        professors,
        loading,
        refreshProfessorsData: fetchData,
        getProfessorById: fetchDataById,
      }}
    >
      {children}
    </ProfessorContext.Provider>
  );
};

export const useProfessor = () => {
  const context = useContext(ProfessorContext);

  if (!context)
    throw new Error("useProfessor must be used within ProfessorProvider");

  return context;
};
