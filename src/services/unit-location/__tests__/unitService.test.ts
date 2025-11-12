import AsyncStorage from "@react-native-async-storage/async-storage";
import { buscarOuCacheUnidadeProxima } from "../unitService";
import { getUserLocation } from "../locationService";
import { UnidadeSugerida } from "../../../types/unit";

// Mocks
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../locationService");
jest.mock("../../apiService", () => ({
  post: jest.fn(),
}));

import api from "../../apiService";
const mockedApi = api as jest.Mocked<typeof api>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedGetUserLocation = getUserLocation as jest.MockedFunction<
  typeof getUserLocation
>;

describe("UnitService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockRestore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("buscarOuCacheUnidadeProxima", () => {
    it("deve retornar unidade do cache quando ainda válida", async () => {
      // Arrange
      const mockUnidade = {
        id: "1",
        nome: "FATEC São Paulo",
        timestamp: Date.now(),
      };
      const currentTime = Date.now();
      const validCacheTime = currentTime - 60000; // 1 minuto atrás

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockImplementation((key) => {
        if (key === "@unidade_sugerida") {
          return Promise.resolve(JSON.stringify(mockUnidade));
        }
        if (key === "@unidade_sugerida_last_update") {
          return Promise.resolve(validCacheTime.toString());
        }
        return Promise.resolve(null);
      });

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toEqual({ id: mockUnidade.id, nome: mockUnidade.nome });
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        "@unidade_sugerida"
      );
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        "@unidade_sugerida_last_update"
      );
      expect(mockedGetUserLocation).not.toHaveBeenCalled();
      expect(mockedApi.post).not.toHaveBeenCalled();
    });

    it("deve buscar nova unidade quando cache expirado", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const expiredCacheTime = currentTime - 200000; // Mais de 180s atrás
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: {
          sucesso: true,
          dados: {
            id: "2",
            nome: "FATEC Tatuapé",
          },
        },
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockImplementation((key) => {
        if (key === "@unidade_sugerida") {
          return Promise.resolve('{"id":"1","nome":"Old Unit"}');
        }
        if (key === "@unidade_sugerida_last_update") {
          return Promise.resolve(expiredCacheTime.toString());
        }
        return Promise.resolve(null);
      });
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toEqual({ id: "2", nome: "FATEC Tatuapé" });
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedApi.post).toHaveBeenCalledWith("/unidades", mockLocation);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "@unidade_sugerida",
        expect.stringContaining('"id":"2"')
      );
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "@unidade_sugerida_last_update",
        currentTime.toString()
      );
    });

    it("deve buscar nova unidade quando não há cache", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: {
          sucesso: true,
          dados: {
            id: "3",
            nome: "FATEC Santana",
          },
        },
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toEqual({ id: "3", nome: "FATEC Santana" });
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedApi.post).toHaveBeenCalledWith("/unidades", mockLocation);
    });

    it("deve retornar null quando API não retorna dados válidos", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: {
          sucesso: false,
          dados: null,
        },
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toBeNull();
    });

    it("deve retornar null quando API retorna dados vazios", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: null,
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toBeNull();
    });

    it("deve retornar null quando getUserLocation lança erro", async () => {
      // Arrange
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockRejectedValue(
        new Error("Localização não disponível")
      );

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toBeNull();
    });

    it("deve retornar null quando API lança erro", async () => {
      // Arrange
      const mockLocation = { latitude: -23.545, longitude: -46.639 };

      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockRejectedValue(new Error("Erro na API"));

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toBeNull();
    });

    it("deve calcular corretamente o tempo de expiração do cache", async () => {
      // Arrange
      const currentTime = 1641000000000;
      jest.spyOn(Date, "now").mockReturnValue(currentTime);

      // Teste 1: Cache válido
      const validCacheTime = currentTime - 60000; // 1 minuto atrás
      const mockUnidade = { id: "1", nome: "FATEC Cached" };

      mockedAsyncStorage.getItem.mockImplementation((key) => {
        if (key === "@unidade_sugerida") {
          return Promise.resolve(JSON.stringify(mockUnidade));
        }
        if (key === "@unidade_sugerida_last_update") {
          return Promise.resolve(validCacheTime.toString());
        }
        return Promise.resolve(null);
      });

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toEqual({ id: "1", nome: "FATEC Cached" });
      expect(mockedGetUserLocation).not.toHaveBeenCalled();
    });

    it("deve salvar timestamp correto no cache", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: {
          sucesso: true,
          dados: {
            id: "4",
            nome: "FATEC Vila Olímpia",
          },
        },
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      await buscarOuCacheUnidadeProxima();

      // Assert
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "@unidade_sugerida",
        expect.stringContaining(`"timestamp":${currentTime}`)
      );
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "@unidade_sugerida_last_update",
        currentTime.toString()
      );
    });

    it("deve lidar com cache corrompido", async () => {
      // Arrange
      const currentTime = 1641000000000;
      const mockLocation = { latitude: -23.545, longitude: -46.639 };
      const mockApiResponse = {
        data: {
          sucesso: true,
          dados: {
            id: "5",
            nome: "FATEC Zona Sul",
          },
        },
      };

      jest.spyOn(Date, "now").mockReturnValue(currentTime);
      mockedAsyncStorage.getItem.mockImplementation((key) => {
        if (key === "@unidade_sugerida") {
          return Promise.resolve("invalid json");
        }
        if (key === "@unidade_sugerida_last_update") {
          return Promise.resolve("not-a-number");
        }
        return Promise.resolve(null);
      });
      mockedGetUserLocation.mockResolvedValue(mockLocation);
      mockedApi.post.mockResolvedValue(mockApiResponse);

      // Act
      const result = await buscarOuCacheUnidadeProxima();

      // Assert
      expect(result).toEqual({ id: "5", nome: "FATEC Zona Sul" });
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedApi.post).toHaveBeenCalled();
    });
  });
});
