import { decodeJwt, isTokenValid } from "../jwt";

// Mock do jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

import { jwtDecode } from "jwt-decode";
const mockedJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

describe("JWT Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date.now mock
    jest.spyOn(Date, "now").mockRestore();
  });

  describe("decodeJwt", () => {
    it("deve decodificar token JWT válido", () => {
      // Arrange
      const mockToken = "valid.jwt.token";
      const expectedPayload = {
        userId: 123,
        email: "test@example.com",
        iat: 1640995200,
        exp: 1641081600,
      };

      mockedJwtDecode.mockReturnValue(expectedPayload);

      // Act
      const result = decodeJwt(mockToken);

      // Assert
      expect(mockedJwtDecode).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(expectedPayload);
    });

    it("deve retornar payload com todos os campos necessários", () => {
      // Arrange
      const mockToken = "another.jwt.token";
      const expectedPayload = {
        userId: 456,
        email: "user@test.com",
        iat: 1640995200,
        exp: 1641081600,
      };

      mockedJwtDecode.mockReturnValue(expectedPayload);

      // Act
      const result = decodeJwt(mockToken);

      // Assert
      expect(result.userId).toBe(456);
      expect(result.email).toBe("user@test.com");
      expect(result.iat).toBe(1640995200);
      expect(result.exp).toBe(1641081600);
    });

    it("deve lançar erro para token inválido", () => {
      // Arrange
      const invalidToken = "invalid.token";
      mockedJwtDecode.mockImplementation(() => {
        throw new Error("Token malformado");
      });

      // Act & Assert
      expect(() => decodeJwt(invalidToken)).toThrow("Token malformado");
    });

    it("deve chamar jwtDecode com token correto", () => {
      // Arrange
      const token = "test.token.here";
      const mockPayload = {
        userId: 1,
        email: "test@example.com",
        iat: 1000000,
        exp: 2000000,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      decodeJwt(token);

      // Assert
      expect(mockedJwtDecode).toHaveBeenCalledTimes(1);
      expect(mockedJwtDecode).toHaveBeenCalledWith(token);
    });
  });

  describe("isTokenValid", () => {
    it("deve retornar true para token válido não expirado", async () => {
      // Arrange
      const mockToken = "valid.token";
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hora no futuro
      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: 1640995200,
        exp: futureTimestamp,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      const result = await isTokenValid(mockToken);

      // Assert
      expect(result).toBe(true);
    });

    it("deve retornar false para token expirado", async () => {
      // Arrange
      const mockToken = "expired.token";
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hora no passado
      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: 1640995200,
        exp: pastTimestamp,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      const result = await isTokenValid(mockToken);

      // Assert
      expect(result).toBe(false);
    });

    it("deve retornar false para token inválido", async () => {
      // Arrange
      const invalidToken = "malformed.token";
      mockedJwtDecode.mockImplementation(() => {
        throw new Error("Token inválido");
      });

      // Act
      const result = await isTokenValid(invalidToken);

      // Assert
      expect(result).toBe(false);
    });

    it("deve comparar corretamente timestamp atual com expiração", async () => {
      // Arrange
      const mockToken = "token.test";
      const currentTime = 1641000000;
      const tokenExpiry = currentTime + 1; // 1 segundo no futuro

      jest.spyOn(Date, "now").mockReturnValue(currentTime * 1000);

      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: currentTime - 3600,
        exp: tokenExpiry,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      const result = await isTokenValid(mockToken);

      // Assert
      expect(result).toBe(true);
    });

    it("deve retornar false quando token expira exatamente no momento atual", async () => {
      // Arrange
      const mockToken = "token.expiring.now";
      const currentTime = 1641000000;

      jest.spyOn(Date, "now").mockReturnValue(currentTime * 1000);

      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: currentTime - 3600,
        exp: currentTime,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      const result = await isTokenValid(mockToken);

      // Assert
      expect(result).toBe(false);
    });

    it("deve lidar com diferentes tipos de erro de decodificação", async () => {
      // Arrange
      const errorCases = [
        new Error("Token malformado"),
        new SyntaxError("JSON inválido"),
        new TypeError("Tipo inválido"),
        "String error",
      ];

      for (const error of errorCases) {
        mockedJwtDecode.mockImplementation(() => {
          throw error;
        });

        // Act
        const result = await isTokenValid("any.token");

        // Assert
        expect(result).toBe(false);
      }
    });

    it("deve usar Math.floor para timestamp atual", async () => {
      // Arrange
      const mockToken = "timestamp.test.token";
      const realTime = 1641000000.999; // Com decimais
      const expectedFlooredTime = 1641000000; // Sem decimais

      jest.spyOn(Date, "now").mockReturnValue(realTime * 1000);
      jest.spyOn(Math, "floor");

      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: 1640995200,
        exp: expectedFlooredTime + 100,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      await isTokenValid(mockToken);

      // Assert
      expect(Math.floor).toHaveBeenCalledWith((realTime * 1000) / 1000);
    });
  });

  describe("integração decodeJwt e isTokenValid", () => {
    it("deve usar decodeJwt internamente em isTokenValid", async () => {
      // Arrange
      const mockToken = "integration.test.token";
      const mockPayload = {
        userId: 123,
        email: "test@example.com",
        iat: 1640995200,
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockedJwtDecode.mockReturnValue(mockPayload);

      // Act
      await isTokenValid(mockToken);

      // Assert
      expect(mockedJwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it("deve funcionar corretamente com tokens reais simulados", async () => {
      // Arrange
      const scenarios = [
        {
          token: "valid.future.token",
          exp: Math.floor(Date.now() / 1000) + 3600,
          expectedValid: true,
        },
        {
          token: "expired.past.token",
          exp: Math.floor(Date.now() / 1000) - 3600,
          expectedValid: false,
        },
        {
          token: "edge.case.token",
          exp: Math.floor(Date.now() / 1000) + 1,
          expectedValid: true,
        },
      ];

      for (const scenario of scenarios) {
        const mockPayload = {
          userId: 123,
          email: "test@example.com",
          iat: Math.floor(Date.now() / 1000) - 3600,
          exp: scenario.exp,
        };

        mockedJwtDecode.mockReturnValue(mockPayload);

        // Act
        const result = await isTokenValid(scenario.token);

        // Assert
        expect(result).toBe(scenario.expectedValid);
      }
    });
  });
});
