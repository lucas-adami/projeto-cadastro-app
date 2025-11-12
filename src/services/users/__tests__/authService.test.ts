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
    it("deve retornar objeto com token quando login é bem-sucedido", async () => {
      // Arrange
      const email = "test@example.com";
      const senha = "password123";
      const expectedToken = "fake-jwt-token";

      mockedApi.post.mockResolvedValue({
        data: { token: expectedToken, user: { id: 1, name: "Test User" } },
      });

      // Act
      const result = await login(email, senha);

      // Assert
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
      expect(result).toHaveProperty("token", expectedToken);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(1);
      expect(result.user.name).toBe("Test User");
    });

    it("deve lançar erro quando login falha", async () => {
      const email = "test@example.com";
      const senha = "wrongpassword";

      mockedApi.post.mockRejectedValue(new Error("Credenciais inválidas"));

      await expect(login(email, senha)).rejects.toThrow("Credenciais inválidas");
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
    });

    it("deve fazer chamada com parâmetros corretos", async () => {
      const email = "user@test.com";
      const senha = "mypassword";

      mockedApi.post.mockResolvedValue({
        data: { token: "some-token", user: { id: 2, name: "User Test" } },
      });

      await login(email, senha);

      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email,
        senha,
      });
    });
  });

  describe("getForgetPasswordToken", () => {
    it("deve retornar token quando esqueci senha é bem-sucedido", async () => {
      const email = "test@example.com";
      const expectedToken = "reset-token-123";

      mockedApi.post.mockResolvedValue({
        data: { token: expectedToken },
      });

      const result = await getForgetPasswordToken(email);

      expect(mockedApi.post).toHaveBeenCalledWith("/auth/esqueceu-senha", {
        email,
      });
      expect(result).toBe(expectedToken);
    });

    it("deve lançar erro quando email não existe", async () => {
      const email = "nonexistent@example.com";

      mockedApi.post.mockRejectedValue(new Error("Email não encontrado"));

      await expect(getForgetPasswordToken(email)).rejects.toThrow("Email não encontrado");
    });

    it("deve fazer chamada com email correto", async () => {
      const email = "valid@email.com";

      mockedApi.post.mockResolvedValue({
        data: { token: "token123" },
      });

      await getForgetPasswordToken(email);

      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/esqueceu-senha", {
        email,
      });
    });
  });

  describe("compareCode", () => {
    it("deve retornar dados quando código é válido", async () => {
      const code = "123456";
      const expectedData = { valid: true, message: "Código válido" };

      mockedApi.post.mockResolvedValue({
        data: expectedData,
      });

      const result = await compareCode(code);

      expect(mockedApi.post).toHaveBeenCalledWith("/auth/verifica-reset-code", {
        code,
      });
      expect(result).toEqual(expectedData);
    });

    it("deve retornar erro quando código é inválido", async () => {
      const code = "invalid-code";

      mockedApi.post.mockRejectedValue(new Error("Código inválido"));

      await expect(compareCode(code)).rejects.toThrow("Código inválido");
    });

    it("deve fazer chamada com código correto", async () => {
      const code = "987654";

      mockedApi.post.mockResolvedValue({
        data: { valid: true },
      });

      await compareCode(code);

      expect(mockedApi.post).toHaveBeenCalledTimes(1);
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/verifica-reset-code", {
        code,
      });
    });

    it("deve lidar com diferentes tipos de resposta", async () => {
      const code = "111111";
      const responseData = {
        valid: false,
        message: "Código expirado",
        expiresAt: "2024-01-01",
      };

      mockedApi.post.mockResolvedValue({
        data: responseData,
      });

      const result = await compareCode(code);

      expect(result).toEqual(responseData);
      expect(result.valid).toBe(false);
      expect(result.message).toBe("Código expirado");
    });
  });
});
