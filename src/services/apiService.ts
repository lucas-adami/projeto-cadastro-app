import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenValid } from "../utils/jwt";
import { authEventEmitter } from "../events/AuthEventEmitter";

const baseURL = API_URL;

const api = axios.create({
  //baseURL: "http://192.168.0.13:3001/",
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    const isValid = await isTokenValid(token);
    if (!isValid) {
      authEventEmitter.emit("logout");
      throw new axios.Cancel("Token Expirado, por favor faça login");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;