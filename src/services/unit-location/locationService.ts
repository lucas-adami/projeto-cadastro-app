import * as Location from 'expo-location';

export async function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização não concedida');
  }

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  // return {
  //   latitude: -23.545000,
  //   longitude: -47.445000
  // };
}
