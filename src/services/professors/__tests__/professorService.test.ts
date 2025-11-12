import {
  postProfessor,
  getProfessors,
  deleteProfessor,
  updateProfessor,
} from "../professorService";
import { Professor } from "../../../types/professor";

// Mock da API
jest.mock("../../apiService", () => ({
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

import api from "../../apiService";
const mockedApi = api as jest.Mocked<typeof api>;

describe("ProfessorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProfessor: Professor = {
    id: 1,
    nome: "Dr. João Silva",
    email: "joao.silva@fatec.sp.gov.br",
    titulacao: "Doutor",
    idUnidade: "1",
    referencia: "MS-3",
    lattes: "http://lattes.cnpq.br/1234567890",
    statusAtividade: "Ativo",
    observacoes: "Professor experiente",
  };

  describe("postProfessor", () => {
    it("deve criar professor com sucesso", async () => {
      // Arrange
      const expectedResponse = {
        id: 1,
        message: "Professor criado com sucesso",
      };

      mockedApi.post.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await postProfessor(mockProfessor);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/professores",
        mockProfessor
      );
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando dados são inválidos", async () => {
      // Arrange
      const invalidProfessor = { ...mockProfessor, email: "email-inválido" };
      mockedApi.post.mockRejectedValue(new Error("Email inválido"));

      // Act & Assert
      await expect(postProfessor(invalidProfessor)).rejects.toThrow(
        "Email inválido"
      );
    });

    it("deve fazer chamada com dados completos do professor", async () => {
      // Arrange
      mockedApi.post.mockResolvedValue({ data: { success: true } });

      // Act
      await postProfessor(mockProfessor);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/professores",
        expect.objectContaining({
          nome: "Dr. João Silva",
          email: "joao.silva@fatec.sp.gov.br",
          titulacao: "Doutor",
        })
      );
    });
  });

  describe("getProfessors", () => {
    const mockProfessors = [
      mockProfessor,
      {
        id: 2,
        nome: "Dra. Maria Santos",
        email: "maria@fatec.sp.gov.br",
        titulacao: "Doutora",
        idUnidade: "2",
        referencia: "MS-2",
        lattes: "http://lattes.cnpq.br/0987654321",
        statusAtividade: "Ativo",
      },
    ];

    it("deve buscar todos os professores sem filtros", async () => {
      // Arrange
      mockedApi.get.mockResolvedValue({
        data: { data: mockProfessors },
      });

      // Act
      const result = await getProfessors();

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: {},
      });
      expect(result).toEqual(mockProfessors);
    });

    it("deve buscar professores com filtro de nome", async () => {
      // Arrange
      const filters = { nome: "João" };
      mockedApi.get.mockResolvedValue({
        data: { data: [mockProfessor] },
      });

      // Act
      const result = await getProfessors(filters);

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: { nome: "João" },
      });
      expect(result).toEqual([mockProfessor]);
    });

    it("deve buscar professores com filtros de cursos", async () => {
      // Arrange
      const filters = { cursos: ["ADS", "DSM"] };
      mockedApi.get.mockResolvedValue({
        data: { data: mockProfessors },
      });

      // Act
      const result = await getProfessors(filters);

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: { cursos: "ADS,DSM" },
      });
      expect(result).toEqual(mockProfessors);
    });

    it("deve buscar professores com filtros de titulação", async () => {
      // Arrange
      const filters = { titulacoes: ["Doutor", "Mestre"] };
      mockedApi.get.mockResolvedValue({
        data: { data: mockProfessors },
      });

      // Act
      const result = await getProfessors(filters);

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: { titulacoes: "Doutor,Mestre" },
      });
    });

    it("deve buscar professores com todos os filtros combinados", async () => {
      // Arrange
      const filters = {
        nome: "João",
        cursos: ["ADS"],
        titulacoes: ["Doutor"],
      };
      mockedApi.get.mockResolvedValue({
        data: { data: [mockProfessor] },
      });

      // Act
      await getProfessors(filters);

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: {
          nome: "João",
          cursos: "ADS",
          titulacoes: "Doutor",
        },
      });
    });

    it("deve ignorar filtros vazios", async () => {
      // Arrange
      const filters = {
        nome: "João",
        cursos: [],
        titulacoes: [],
      };
      mockedApi.get.mockResolvedValue({
        data: { data: [mockProfessor] },
      });

      // Act
      await getProfessors(filters);

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/professores", {
        params: { nome: "João" },
      });
    });
  });

  describe("deleteProfessor", () => {
    it("deve deletar professor com sucesso", async () => {
      // Arrange
      const professorId = 1;
      const expectedResponse = { message: "Professor removido com sucesso" };

      mockedApi.delete.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await deleteProfessor(professorId);

      // Assert
      expect(mockedApi.delete).toHaveBeenCalledWith(
        `/professores/${professorId}`
      );
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando professor não existe", async () => {
      // Arrange
      const professorId = 999;
      mockedApi.delete.mockRejectedValue(new Error("Professor não encontrado"));

      // Act & Assert
      await expect(deleteProfessor(professorId)).rejects.toThrow(
        "Professor não encontrado"
      );
    });

    it("deve usar ID correto na URL", async () => {
      // Arrange
      const professorId = 42;
      mockedApi.delete.mockResolvedValue({ data: { success: true } });

      // Act
      await deleteProfessor(professorId);

      // Assert
      expect(mockedApi.delete).toHaveBeenCalledWith("/professores/42");
    });
  });

  describe("updateProfessor", () => {
    it("deve atualizar professor com sucesso", async () => {
      // Arrange
      const professorId = 1;
      const updatedData = {
        ...mockProfessor,
        nome: "Dr. João Silva Atualizado",
      };
      const expectedResponse = {
        id: professorId,
        message: "Professor atualizado com sucesso",
      };

      mockedApi.put.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await updateProfessor(professorId, updatedData);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/professores/${professorId}`,
        updatedData
      );
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando professor não existe", async () => {
      // Arrange
      const professorId = 999;
      mockedApi.put.mockRejectedValue(new Error("Professor não encontrado"));

      // Act & Assert
      await expect(updateProfessor(professorId, mockProfessor)).rejects.toThrow(
        "Professor não encontrado"
      );
    });

    it("deve atualizar campos específicos", async () => {
      // Arrange
      const professorId = 1;
      const partialUpdate = {
        ...mockProfessor,
        email: "novo.email@fatec.sp.gov.br",
        statusAtividade: "Inativo",
      };

      mockedApi.put.mockResolvedValue({ data: { success: true } });

      // Act
      await updateProfessor(professorId, partialUpdate);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/professores/${professorId}`,
        partialUpdate
      );
    });

    it("deve usar IDs corretos na chamada", async () => {
      // Arrange
      const professorId = 123;
      mockedApi.put.mockResolvedValue({ data: { success: true } });

      // Act
      await updateProfessor(professorId, mockProfessor);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        "/professores/123",
        mockProfessor
      );
    });
  });
});
