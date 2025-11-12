import AsyncStorage from "@react-native-async-storage/async-storage";
import { signUp, updateUser, getLoggedUser, UserData } from "../userService";
import { decodeJwt } from "../../../utils/jwt";

// Mocks
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../../utils/jwt");
jest.mock("../../apiService", () => ({
  post: jest.fn(),
  put: jest.fn(),
  get: jest.fn(),
}));

import api from "../../apiService";
const mockedApi = api as jest.Mocked<typeof api>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedDecodeJwt = decodeJwt as jest.MockedFunction<typeof decodeJwt>;

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("deve criar usuário com sucesso", async () => {
      // Arrange
      const userData: UserData = {
        nome: "João Silva",
        email: "joao@example.com",
        senha: "password123",
      };
      const expectedResponse = {
        id: 1,
        message: "Usuário criado com sucesso",
      };

      mockedApi.post.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await signUp(userData);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/usuarios", userData);
      expect(result).toEqual(expectedResponse);
    });

    it("deve lançar erro quando dados são inválidos", async () => {
      // Arrange
      const userData: UserData = {
        nome: "",
        email: "invalid-email",
        senha: "123",
      };

      mockedApi.post.mockRejectedValue(new Error("Dados inválidos"));

      // Act & Assert
      await expect(signUp(userData)).rejects.toThrow("Dados inválidos");
      expect(mockedApi.post).toHaveBeenCalledWith("/usuarios", userData);
    });

    it("deve fazer chamada com todos os campos obrigatórios", async () => {
      // Arrange
      const userData: UserData = {
        nome: "Maria Santos",
        email: "maria@test.com",
        senha: "securepassword",
      };

      mockedApi.post.mockResolvedValue({
        data: { success: true },
      });

      // Act
      await signUp(userData);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/usuarios", {
        nome: "Maria Santos",
        email: "maria@test.com",
        senha: "securepassword",
      });
    });
  });

  describe("updateUser", () => {
    it("deve atualizar usuário com sucesso", async () => {
      // Arrange
      const userId = "123";
      const updateData: Partial<UserData> = {
        nome: "João Silva Atualizado",
        email: "joao.novo@example.com",
      };
      const expectedResponse = {
        id: userId,
        message: "Usuário atualizado com sucesso",
      };

      mockedApi.put.mockResolvedValue({
        data: expectedResponse,
      });

      // Act
      const result = await updateUser(updateData, userId);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/usuarios/${userId}`,
        updateData
      );
      expect(result).toEqual(expectedResponse);
    });

    it("deve permitir atualização parcial de dados", async () => {
      // Arrange
      const userId = "456";
      const partialData: Partial<UserData> = {
        nome: "Novo Nome",
      };

      mockedApi.put.mockResolvedValue({
        data: { success: true },
      });

      // Act
      await updateUser(partialData, userId);

      // Assert
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/usuarios/${userId}`,
        partialData
      );
    });

    it("deve lançar erro quando usuário não existe", async () => {
      // Arrange
      const userId = "999";
      const updateData: Partial<UserData> = {
        nome: "Nome Teste",
      };

      mockedApi.put.mockRejectedValue(new Error("Usuário não encontrado"));

      // Act & Assert
      await expect(updateUser(updateData, userId)).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });

  describe("getLoggedUser", () => {
    it("deve retornar dados do usuário logado", async () => {
      // Arrange
      const mockToken = "fake-jwt-token";
      const mockPayload = { userId: 123, email: "test@example.com" };
      const mockUserData = {
        id: 123,
        nome: "Usuário Teste",
        email: "test@example.com",
      };

      mockedAsyncStorage.getItem.mockResolvedValue(mockToken);
      mockedDecodeJwt.mockReturnValue(mockPayload as any);
      mockedApi.get.mockResolvedValue({
        data: { data: mockUserData },
      });

      // Act
      const result = await getLoggedUser();

      // Assert
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("token");
      expect(mockedDecodeJwt).toHaveBeenCalledWith(mockToken);
      expect(mockedApi.get).toHaveBeenCalledWith(
        `/usuarios/${mockPayload.userId}`
      );
      expect(result).toEqual(mockUserData);
    });

    it("deve lançar erro quando token não existe no AsyncStorage", async () => {
      // Arrange
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      // Act & Assert
      await expect(getLoggedUser()).rejects.toThrow(
        "Token não encontrado no AsyncStorage"
      );
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("token");
    });

    it("deve lançar erro quando token é inválido", async () => {
      // Arrange
      const mockToken = "invalid-token";

      mockedAsyncStorage.getItem.mockResolvedValue(mockToken);
      mockedDecodeJwt.mockImplementation(() => {
        throw new Error("Token inválido");
      });

      // Act & Assert
      await expect(getLoggedUser()).rejects.toThrow("Token inválido");
    });

    it("deve lançar erro quando API falha ao buscar usuário", async () => {
      // Arrange
      const mockToken = "valid-token";
      const mockPayload = { userId: 123, email: "test@example.com" };

      mockedAsyncStorage.getItem.mockResolvedValue(mockToken);
      mockedDecodeJwt.mockReturnValue(mockPayload as any);
      mockedApi.get.mockRejectedValue(new Error("Usuário não encontrado"));

      // Act & Assert
      await expect(getLoggedUser()).rejects.toThrow("Usuário não encontrado");
    });

    it("deve usar o userId correto do token decodificado", async () => {
      // Arrange
      const mockToken = "jwt-token";
      const mockPayload = { userId: 456, email: "user456@test.com" };

      mockedAsyncStorage.getItem.mockResolvedValue(mockToken);
      mockedDecodeJwt.mockReturnValue(mockPayload as any);
      mockedApi.get.mockResolvedValue({
        data: { data: { id: 456 } },
      });

      // Act
      await getLoggedUser();

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/usuarios/456");
    });
  });
});
