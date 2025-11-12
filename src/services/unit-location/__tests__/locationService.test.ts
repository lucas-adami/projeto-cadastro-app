import * as Location from "expo-location";
import { getUserLocation } from "../locationService";

// Mock do expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

const mockedLocation = Location as jest.Mocked<typeof Location>;

describe("LocationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserLocation", () => {
    it("deve retornar coordenadas quando permissão concedida", async () => {
      // Arrange
      const mockPosition = {
        coords: {
          latitude: -23.5458,
          longitude: -46.6396,
          altitude: 760,
          accuracy: 5,
          altitudeAccuracy: 5,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      };

      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });
      mockedLocation.getCurrentPositionAsync.mockResolvedValue(mockPosition);

      // Act
      const result = await getUserLocation();

      // Assert
      expect(result).toEqual({
        latitude: -23.5458,
        longitude: -46.6396,
      });
      expect(
        mockedLocation.requestForegroundPermissionsAsync
      ).toHaveBeenCalledTimes(1);
      expect(mockedLocation.getCurrentPositionAsync).toHaveBeenCalledWith({});
    });

    it("deve lançar erro quando permissão negada", async () => {
      // Arrange
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "denied" as any,
        granted: false,
        canAskAgain: true,
        expires: "never",
      });

      // Act & Assert
      await expect(getUserLocation()).rejects.toThrow(
        "Permissão de localização não concedida"
      );
      expect(
        mockedLocation.requestForegroundPermissionsAsync
      ).toHaveBeenCalledTimes(1);
      expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando permissão é undetermined", async () => {
      // Arrange
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "undetermined" as any,
        granted: false,
        canAskAgain: true,
        expires: "never",
      });

      // Act & Assert
      await expect(getUserLocation()).rejects.toThrow(
        "Permissão de localização não concedida"
      );
    });

    it("deve retornar coordenadas precisas de diferentes localizações", async () => {
      // Arrange
      const testLocations = [
        { latitude: -23.5458, longitude: -46.6396 }, // São Paulo
        { latitude: -22.9068, longitude: -43.1729 }, // Rio de Janeiro
        { latitude: -19.9167, longitude: -43.9345 }, // Belo Horizonte
      ];

      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });

      for (const location of testLocations) {
        const mockPosition = {
          coords: {
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: 760,
            accuracy: 5,
            altitudeAccuracy: 5,
            heading: 0,
            speed: 0,
          },
          timestamp: Date.now(),
        };

        mockedLocation.getCurrentPositionAsync.mockResolvedValue(mockPosition);

        // Act
        const result = await getUserLocation();

        // Assert
        expect(result).toEqual({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    });

    it("deve propagar erro do getCurrentPositionAsync", async () => {
      // Arrange
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });
      mockedLocation.getCurrentPositionAsync.mockRejectedValue(
        new Error("GPS não disponível")
      );

      // Act & Assert
      await expect(getUserLocation()).rejects.toThrow("GPS não disponível");
    });

    it("deve propagar erro do requestForegroundPermissionsAsync", async () => {
      // Arrange
      mockedLocation.requestForegroundPermissionsAsync.mockRejectedValue(
        new Error("Erro ao solicitar permissão")
      );

      // Act & Assert
      await expect(getUserLocation()).rejects.toThrow(
        "Erro ao solicitar permissão"
      );
    });

    it("deve chamar getCurrentPositionAsync com configuração vazia", async () => {
      // Arrange
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });
      mockedLocation.getCurrentPositionAsync.mockResolvedValue({
        coords: {
          latitude: -23.5458,
          longitude: -46.6396,
          altitude: 0,
          accuracy: 5,
          altitudeAccuracy: 5,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      });

      // Act
      await getUserLocation();

      // Assert
      expect(mockedLocation.getCurrentPositionAsync).toHaveBeenCalledWith({});
    });

    it("deve extrair apenas latitude e longitude da posição", async () => {
      // Arrange
      const mockPosition = {
        coords: {
          latitude: -23.5458,
          longitude: -46.6396,
          altitude: 800,
          accuracy: 10,
          altitudeAccuracy: 15,
          heading: 180,
          speed: 0,
        },
        timestamp: 1641000000000,
      };

      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
        granted: true,
        canAskAgain: true,
        expires: "never",
      });
      mockedLocation.getCurrentPositionAsync.mockResolvedValue(mockPosition);

      // Act
      const result = await getUserLocation();

      // Assert
      expect(result).toEqual({
        latitude: -23.5458,
        longitude: -46.6396,
      });
      // Verificar que outros campos não estão presentes
      expect(result).not.toHaveProperty("altitude");
      expect(result).not.toHaveProperty("accuracy");
      expect(result).not.toHaveProperty("timestamp");
    });

    it("deve lidar com diferentes status de permissão", async () => {
      // Arrange
      const statusTests = [
        { status: "granted", shouldThrow: false },
        { status: "denied", shouldThrow: true },
        { status: "undetermined", shouldThrow: true },
      ];

      for (const test of statusTests) {
        jest.clearAllMocks();

        mockedLocation.requestForegroundPermissionsAsync.mockResolvedValue({
          status: test.status as any,
          granted: test.status === "granted",
          canAskAgain: true,
          expires: "never",
        });

        if (!test.shouldThrow) {
          mockedLocation.getCurrentPositionAsync.mockResolvedValue({
            coords: {
              latitude: -23.5458,
              longitude: -46.6396,
              altitude: 0,
              accuracy: 5,
              altitudeAccuracy: 5,
              heading: 0,
              speed: 0,
            },
            timestamp: Date.now(),
          });
        }

        // Act & Assert
        if (test.shouldThrow) {
          await expect(getUserLocation()).rejects.toThrow(
            "Permissão de localização não concedida"
          );
        } else {
          await expect(getUserLocation()).resolves.toBeDefined();
        }
      }
    });
  });
});
