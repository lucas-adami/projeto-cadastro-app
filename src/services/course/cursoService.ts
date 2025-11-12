import AsyncStorage from "@react-native-async-storage/async-storage";
import { Course } from "../../types/courses";
import api from "../apiService";

export const getCourses = async () => {
  const response = await api.get("/cursos");

  //forma de como a lista de cursos está vindo do backend
  //response.data.data
  //data = {message: Cursos encontrados com sucesso, data: []}
  return response.data.data;
};

export const postCourse = async (data: Course) => {
  const response = await api.post("/cursos", data);

  const token = AsyncStorage.getItem("token");

  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`/cursos/${id}`);

  return response.data;
};

export const updateCourse = async (id: string, data: Course) => {
  const response = await api.put(`/cursos/${id}`, data);

  return response.data;
};
