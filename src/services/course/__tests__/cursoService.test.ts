import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCourses,
  postCourse,
  deleteCourse,
  updateCourse,
} from "../cursoService";
import { Course } from "../../../types/courses";

// Mocks
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../apiService", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

import api from "../../apiService";
const mockedApi = api as jest.Mocked<typeof api>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("CursoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCourse: Course = {
    id: 1,
    nome: "Análise e Desenvolvimento de Sistemas",
    codigo: "ADS001",
    sigla: "ADS",
    modelo: undefined,
    coordenadorId: 123,
  };

  describe("getCourses", () => {
    it("deve buscar todos os cursos com sucesso", async () => {
      // Arrange
      const mockCourses = [
        mockCourse,
        {
          id: 2,
          nome: "Desenvolvimento de Software Multiplataforma",
          codigo: "DSM001",
          sigla: "DSM",
          modelo: undefined,
          coordenadorId: 456,
        },
      ];

      mockedApi.get.mockResolvedValue({
        data: { data: mockCourses },
      });

      // Act
      const result = await getCourses();

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/cursos");
      expect(result).toEqual(mockCourses);
    });

    it("deve retornar array vazio quando não há cursos", async () => {
      // Arrange
      mockedApi.get.mockResolvedValue({
        data: { data: [] },
      });

      // Act
      const result = await getCourses();

      // Assert
      expect(result).toEqual([]);
    });

    it("deve lançar erro quando API falha", async () => {
      // Arrange
      mockedApi.get.mockRejectedValue(new Error("Erro interno do servidor"));

      // Act & Assert
      await expect(getCourses()).rejects.toThrow("Erro interno do servidor");
    });

    it("deve fazer chamada correta para API", async () => {
      // Arrange
      mockedApi.get.mockResolvedValue({
        data: { data: [mockCourse] },
      });

      // Act
      await getCourses();

      // Assert
      expect(mockedApi.get).toHaveBeenCalledTimes(1);
      expect(mockedApi.get).toHaveBeenCalledWith("/cursos");
    });
  });

  describe("postCourse", () => {
    it("deve criar curso com sucesso", async () => {
      // Arrange
      const expectedResponse = {
        id: 1,
        message: "Curso criado com sucesso",
      };

      mockedApi.post.mockResolvedValue({
        data: expectedResponse,
      });
      mockedAsyncStorage.getItem.mockResolvedValue("fake-token");

      // Act
      const result = await postCourse(mockCourse);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/cursos", mockCourse);
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("token");
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando dados são inválidos", async () => {
      // Arrange
      const invalidCourse = { ...mockCourse, nome: "" };
      mockedApi.post.mockRejectedValue(
        new Error("Nome do curso é obrigatório")
      );

      // Act & Assert
      await expect(postCourse(invalidCourse)).rejects.toThrow(
        "Nome do curso é obrigatório"
      );
    });

    it("deve verificar token no AsyncStorage", async () => {
      // Arrange
      mockedApi.post.mockResolvedValue({ data: { success: true } });
      mockedAsyncStorage.getItem.mockResolvedValue("valid-token");

      // Act
      await postCourse(mockCourse);

      // Assert
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("token");
    });

    it("deve fazer chamada com dados completos do curso", async () => {
      // Arrange
      mockedApi.post.mockResolvedValue({ data: { success: true } });
      mockedAsyncStorage.getItem.mockResolvedValue("token");

      // Act
      await postCourse(mockCourse);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/cursos",
        expect.objectContaining({
          nome: "Análise e Desenvolvimento de Sistemas",
          codigo: "ADS001",
          sigla: "ADS",
          coordenadorId: 123,
        })
      );
    });
  });

  describe("deleteCourse", () => {
    it("deve deletar curso com sucesso", async () => {
      // Arrange
      const courseId = 1;
      const expectedResponse = { message: "Curso removido com sucesso" };

      mockedApi.delete.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await deleteCourse(courseId);

      // Assert
      expect(mockedApi.delete).toHaveBeenCalledWith(`/cursos/${courseId}`);
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando curso não existe", async () => {
      // Arrange
      const courseId = 999;
      mockedApi.delete.mockRejectedValue(new Error("Curso não encontrado"));

      // Act & Assert
      await expect(deleteCourse(courseId)).rejects.toThrow(
        "Curso não encontrado"
      );
    });

    it("deve usar ID correto na URL", async () => {
      // Arrange
      const courseId = 42;
      mockedApi.delete.mockResolvedValue({ data: { success: true } });

      // Act
      await deleteCourse(courseId);

      // Assert
      expect(mockedApi.delete).toHaveBeenCalledWith("/cursos/42");
    });

    it("deve lançar erro quando curso possui dependências", async () => {
      // Arrange
      const courseId = 1;
      mockedApi.delete.mockRejectedValue(
        new Error("Curso possui professores vinculados")
      );

      // Act & Assert
      await expect(deleteCourse(courseId)).rejects.toThrow(
        "Curso possui professores vinculados"
      );
    });
  });

  describe("updateCourse", () => {
    it("deve atualizar curso com sucesso", async () => {
      // Arrange
      const courseId = 1;
      const updatedCourse = {
        ...mockCourse,
        nome: "Análise e Desenvolvimento de Sistemas Atualizado",
      };
      const expectedResponse = {
        id: courseId,
        message: "Curso atualizado com sucesso",
      };

      mockedApi.put.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await updateCourse(courseId, updatedCourse);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/cursos/${courseId}`,
        updatedCourse
      );
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando curso não existe", async () => {
      // Arrange
      const courseId = 999;
      mockedApi.put.mockRejectedValue(new Error("Curso não encontrado"));

      // Act & Assert
      await expect(updateCourse(courseId, mockCourse)).rejects.toThrow(
        "Curso não encontrado"
      );
    });

    it("deve atualizar campos específicos", async () => {
      // Arrange
      const courseId = 1;
      const partialUpdate = {
        ...mockCourse,
        sigla: "ADST",
        coordenadorId: 789,
      };

      mockedApi.put.mockResolvedValue({ data: { success: true } });

      // Act
      await updateCourse(courseId, partialUpdate);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/cursos/${courseId}`,
        partialUpdate
      );
    });

    it("deve usar IDs corretos na chamada", async () => {
      // Arrange
      const courseId = 123;
      mockedApi.put.mockResolvedValue({ data: { success: true } });

      // Act
      await updateCourse(courseId, mockCourse);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith("/cursos/123", mockCourse);
    });

    it("deve lançar erro para dados inválidos na atualização", async () => {
      // Arrange
      const courseId = 1;
      const invalidCourse = { ...mockCourse, codigo: "" };
      mockedApi.put.mockRejectedValue(
        new Error("Código do curso é obrigatório")
      );

      // Act & Assert
      await expect(updateCourse(courseId, invalidCourse)).rejects.toThrow(
        "Código do curso é obrigatório"
      );
    });

    it("deve permitir atualizar apenas coordenador", async () => {
      // Arrange
      const courseId = 1;
      const updatedCourse = { ...mockCourse, coordenadorId: 999 };

      mockedApi.put.mockResolvedValue({ data: { success: true } });

      // Act
      await updateCourse(courseId, updatedCourse);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/cursos/${courseId}`,
        expect.objectContaining({ coordenadorId: 999 })
      );
    });
  });
});
