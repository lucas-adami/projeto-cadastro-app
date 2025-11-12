import { ModeloCurso } from "../enums/courses/courseEnum";
import { Materia } from "./materia";

export type Course = {
  id?: string;
  nome: string;
  codigo: string;
  sigla: string;
  modelo: ModeloCurso | undefined;
  coordenadorId: string | undefined;
  materias?: Materia[];
};
