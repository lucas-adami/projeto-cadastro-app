import * as Location from "expo-location";

// Coordenadas de locais válidos para registro de ponto
// TODO: Substitua estas coordenadas pela sua casa para desenvolvimento
const VALID_LOCATIONS = [
  {
    name: "Fatec Votorantim",
    latitude: -23.439583, // Exemplo: São Paulo - SUBSTITUA pela sua localização
    longitude: -47.368,
    radius: 1000, // raio em metros
  },
  // Adicione outros locais válidos conforme necessário
  // {
  //   name: 'Escritório',
  //   latitude: -23.561,
  //   longitude: -46.656,
  //   radius: 50,
  // },
];

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 * @param lat1 Latitude do ponto 1
 * @param lon1 Longitude do ponto 1
 * @param lat2 Latitude do ponto 2
 * @param lon2 Longitude do ponto 2
 * @returns Distância em metros
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Solicita permissão de localização ao usuário
 * @returns true se a permissão foi concedida, false caso contrário
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Erro ao solicitar permissão de localização:", error);
    return false;
  }
}

/**
 * Obtém a localização atual do usuário
 * @returns Objeto com latitude e longitude, ou null em caso de erro
 */
export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      throw new Error("Permissão de localização negada");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Erro ao obter localização atual:", error);
    throw error;
  }
}

/**
 * Verifica se o usuário está em um local válido para registro de ponto
 * @returns Objeto com informações sobre a validação
 */
export async function validateUserLocation(): Promise<{
  isValid: boolean;
  message: string;
  nearestLocation?: string;
  distance?: number;
}> {
  try {
    const currentLocation = await getCurrentLocation();

    if (!currentLocation) {
      return {
        isValid: false,
        message:
          "Não foi possível obter sua localização. Verifique se o GPS está ativado.",
      };
    }

    // Verifica se está dentro de algum raio válido
    for (const validLocation of VALID_LOCATIONS) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        validLocation.latitude,
        validLocation.longitude
      );

      if (distance <= validLocation.radius) {
        return {
          isValid: true,
          message: `Localização validada: ${validLocation.name}`,
          nearestLocation: validLocation.name,
          distance: Math.round(distance),
        };
      }
    }

    // Encontra o local mais próximo
    let nearestLocation = VALID_LOCATIONS[0];
    let minDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      nearestLocation.latitude,
      nearestLocation.longitude
    );

    for (let i = 1; i < VALID_LOCATIONS.length; i++) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        VALID_LOCATIONS[i].latitude,
        VALID_LOCATIONS[i].longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = VALID_LOCATIONS[i];
      }
    }

    return {
      isValid: false,
      message: `Você está a ${Math.round(minDistance)}m do local de trabalho (${
        nearestLocation.name
      }). Por favor, dirija-se ao local correto para registrar o ponto.`,
      nearestLocation: nearestLocation.name,
      distance: Math.round(minDistance),
    };
  } catch (error: any) {
    console.error("Erro ao validar localização:", error);
    return {
      isValid: false,
      message: error.message || "Erro ao validar localização. Tente novamente.",
    };
  }
}
