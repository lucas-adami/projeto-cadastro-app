import axios from "axios";
import { login, getForgetPasswordToken, compareCode } from "../authService";

// Mock do axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock da api
jest.mock("../../apiService", () => ({
  post: jest.fn(),
}));

import api from "../../apiService";
const mockedApi = api as jest.Mocked<typeof api>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve retornar token quando login é bem-sucedido", async () => {
      // Arrange
      const email = "test@example.com";
      const senha = "password123";
      const expectedToken = "fake-jwt-token";

      mockedApi.post.mockResolvedValue({
        data: { token: expectedToken },
      });

      // Act
      const result = await login(email, senha);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
      expect(result).toBe(expectedToken);
    });

    it("deve lançar erro quando login falha", async () => {
      // Arrange
      const email = "test@example.com";
      const senha = "wrongpassword";

      mockedApi.post.mockRejectedValue(new Error("Credenciais inválidas"));

      // Act & Assert
      await expect(login(email, senha)).rejects.toThrow(
        "Credenciais inválidas"
      );
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
    });

    it("deve fazer chamada com parâmetros corretos", async () => {
      // Arrange
      const email = "user@test.com";
      const senha = "mypassword";

      mockedApi.post.mockResolvedValue({
        data: { token: "some-token" },
      });

      // Act
      await login(email, senha);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
    });
  });

  describe("getForgetPasswordToken", () => {
    it("deve retornar token quando esqueci senha é bem-sucedido", async () => {
      // Arrange
      const email = "test@example.com";
      const expectedToken = "reset-token-123";

      mockedApi.post.mockResolvedValue({
        data: { token: expectedToken },
      });

      // Act
      const result = await getForgetPasswordToken(email);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/esqueceu-senha", {
        email,
      });
      expect(result).toBe(expectedToken);
    });

    it("deve lançar erro quando email não existe", async () => {
      // Arrange
      const email = "nonexistent@example.com";

      mockedApi.post.mockRejectedValue(new Error("Email não encontrado"));

      // Act & Assert
      await expect(getForgetPasswordToken(email)).rejects.toThrow(
        "Email não encontrado"
      );
    });

    it("deve fazer chamada com email correto", async () => {
      // Arrange
      const email = "valid@email.com";

      mockedApi.post.mockResolvedValue({
        data: { token: "token123" },
      });

      // Act
      await getForgetPasswordToken(email);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/esqueceu-senha", {
        email,
      });
    });
  });

  describe("compareCode", () => {
    it("deve retornar dados quando código é válido", async () => {
      // Arrange
      const code = "123456";
      const expectedData = { valid: true, message: "Código válido" };

      mockedApi.post.mockResolvedValue({
        data: expectedData,
      });

      // Act
      const result = await compareCode(code);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/verifica-reset-code", {
        code,
      });
      expect(result).toEqual(expectedData);
    });

    it("deve retornar erro quando código é inválido", async () => {
      // Arrange
      const code = "invalid-code";

      mockedApi.post.mockRejectedValue(new Error("Código inválido"));

      // Act & Assert
      await expect(compareCode(code)).rejects.toThrow("Código inválido");
    });

    it("deve fazer chamada com código correto", async () => {
      // Arrange
      const code = "987654";

      mockedApi.post.mockResolvedValue({
        data: { valid: true },
      });

      // Act
      await compareCode(code);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/verifica-reset-code", {
        code,
      });
    });

    it("deve lidar com diferentes tipos de resposta", async () => {
      // Arrange
      const code = "111111";
      const responseData = {
        valid: false,
        message: "Código expirado",
        expiresAt: "2024-01-01",
      };

      mockedApi.post.mockResolvedValue({
        data: responseData,
      });

      // Act
      const result = await compareCode(code);

      // Assert
      expect(result).toEqual(responseData);
      expect(result.valid).toBe(false);
      expect(result.message).toBe("Código expirado");
    });
  });
});
