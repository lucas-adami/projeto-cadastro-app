import { groupByTitulacao } from "../filterUtilities";
import { Professor } from "../../types/professor";

describe("FilterUtilities", () => {
  describe("groupByTitulacao", () => {
    it("deve agrupar professores por titulação corretamente", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "Dr. João Silva",
          email: "joao@fatec.sp.gov.br",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-1",
          lattes: "http://lattes.cnpq.br/123",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "Prof. Maria Santos",
          email: "maria@fatec.sp.gov.br",
          titulacao: "Mestre",
          idUnidade: "1",
          referencia: "MS-2",
          lattes: "http://lattes.cnpq.br/456",
          statusAtividade: "Ativo",
        },
        {
          id: 3,
          nome: "Prof. Carlos Oliveira",
          email: "carlos@fatec.sp.gov.br",
          titulacao: "Doutor",
          idUnidade: "2",
          referencia: "DR-2",
          lattes: "http://lattes.cnpq.br/789",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Doutor", "Mestre"],
        data: [2, 1],
      });
    });

    it("deve lidar com array vazio", () => {
      // Arrange
      const professors: Professor[] = [];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: [],
        data: [],
      });
    });

    it("deve agrupar uma única titulação", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "Prof. Ana Costa",
          email: "ana@fatec.sp.gov.br",
          titulacao: "Especialista",
          idUnidade: "1",
          referencia: "ESP-1",
          lattes: "http://lattes.cnpq.br/111",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "Prof. Pedro Lima",
          email: "pedro@fatec.sp.gov.br",
          titulacao: "Especialista",
          idUnidade: "2",
          referencia: "ESP-2",
          lattes: "http://lattes.cnpq.br/222",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Especialista"],
        data: [2],
      });
    });

    it("deve manter ordem de aparição das titulações", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "Prof. A",
          email: "a@fatec.sp.gov.br",
          titulacao: "Mestre",
          idUnidade: "1",
          referencia: "MS-1",
          lattes: "http://lattes.cnpq.br/a",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "Prof. B",
          email: "b@fatec.sp.gov.br",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-1",
          lattes: "http://lattes.cnpq.br/b",
          statusAtividade: "Ativo",
        },
        {
          id: 3,
          nome: "Prof. C",
          email: "c@fatec.sp.gov.br",
          titulacao: "Especialista",
          idUnidade: "1",
          referencia: "ESP-1",
          lattes: "http://lattes.cnpq.br/c",
          statusAtividade: "Ativo",
        },
        {
          id: 4,
          nome: "Prof. D",
          email: "d@fatec.sp.gov.br",
          titulacao: "Mestre",
          idUnidade: "1",
          referencia: "MS-2",
          lattes: "http://lattes.cnpq.br/d",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result.labels).toEqual(["Mestre", "Doutor", "Especialista"]);
      expect(result.data).toEqual([2, 1, 1]);
    });

    it("deve contar corretamente múltiplas titulações", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "A",
          email: "a@test.com",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-1",
          lattes: "http://test.com/1",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "B",
          email: "b@test.com",
          titulacao: "Mestre",
          idUnidade: "1",
          referencia: "MS-1",
          lattes: "http://test.com/2",
          statusAtividade: "Ativo",
        },
        {
          id: 3,
          nome: "C",
          email: "c@test.com",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-2",
          lattes: "http://test.com/3",
          statusAtividade: "Ativo",
        },
        {
          id: 4,
          nome: "D",
          email: "d@test.com",
          titulacao: "Especialista",
          idUnidade: "1",
          referencia: "ESP-1",
          lattes: "http://test.com/4",
          statusAtividade: "Ativo",
        },
        {
          id: 5,
          nome: "E",
          email: "e@test.com",
          titulacao: "Mestre",
          idUnidade: "1",
          referencia: "MS-2",
          lattes: "http://test.com/5",
          statusAtividade: "Ativo",
        },
        {
          id: 6,
          nome: "F",
          email: "f@test.com",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-3",
          lattes: "http://test.com/6",
          statusAtividade: "Ativo",
        },
        {
          id: 7,
          nome: "G",
          email: "g@test.com",
          titulacao: "Graduado",
          idUnidade: "1",
          referencia: "GR-1",
          lattes: "http://test.com/7",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Doutor", "Mestre", "Especialista", "Graduado"],
        data: [3, 2, 1, 1],
      });
    });

    it("deve lidar com titulações com espaços e caracteres especiais", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "Prof. A",
          email: "a@test.com",
          titulacao: "Pós-Doutor",
          idUnidade: "1",
          referencia: "PD-1",
          lattes: "http://test.com/1",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "Prof. B",
          email: "b@test.com",
          titulacao: "Pós-Doutor",
          idUnidade: "1",
          referencia: "PD-2",
          lattes: "http://test.com/2",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Pós-Doutor"],
        data: [2],
      });
    });

    it("deve tratar titulações idênticas case-sensitive", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "Prof. A",
          email: "a@test.com",
          titulacao: "Doutor",
          idUnidade: "1",
          referencia: "DR-1",
          lattes: "http://test.com/1",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "Prof. B",
          email: "b@test.com",
          titulacao: "doutor",
          idUnidade: "1",
          referencia: "DR-2",
          lattes: "http://test.com/2",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Doutor", "doutor"],
        data: [1, 1],
      });
    });

    it("deve retornar arrays com mesmo tamanho para labels e data", () => {
      // Arrange
      const professors: Professor[] = [
        {
          id: 1,
          nome: "A",
          email: "a@test.com",
          titulacao: "T1",
          idUnidade: "1",
          referencia: "R1",
          lattes: "http://test.com/1",
          statusAtividade: "Ativo",
        },
        {
          id: 2,
          nome: "B",
          email: "b@test.com",
          titulacao: "T2",
          idUnidade: "1",
          referencia: "R2",
          lattes: "http://test.com/2",
          statusAtividade: "Ativo",
        },
        {
          id: 3,
          nome: "C",
          email: "c@test.com",
          titulacao: "T3",
          idUnidade: "1",
          referencia: "R3",
          lattes: "http://test.com/3",
          statusAtividade: "Ativo",
        },
      ];

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result.labels.length).toBe(result.data.length);
      expect(result.labels.length).toBe(3);
      expect(result.data.every((count) => count === 1)).toBe(true);
    });

    it("deve somar corretamente quando há muitos professores da mesma titulação", () => {
      // Arrange
      const professors: Professor[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        nome: `Prof. ${i + 1}`,
        email: `prof${i + 1}@test.com`,
        titulacao: "Mestre",
        idUnidade: "1",
        referencia: `MS-${i + 1}`,
        lattes: `http://test.com/${i + 1}`,
        statusAtividade: "Ativo",
      }));

      // Act
      const result = groupByTitulacao(professors);

      // Assert
      expect(result).toEqual({
        labels: ["Mestre"],
        data: [15],
      });
    });
  });
});
