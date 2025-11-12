"use client";

import { getCourses } from "../services/course/cursoService";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Course } from "../types/courses";
import { useToast } from "../utils/useToast";

type CourseContextType = {
  courses: Course[];
  loading: boolean;
  refreshCoursesData: () => void;
  getCourseById: (id: string) => Course | undefined;
};

export const CourseContext = createContext<CourseContextType | undefined>(
  undefined
);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error: any) {
      const apiResponse = error.response?.data;
      if (apiResponse && apiResponse.success === false) {
        showError(apiResponse.mensagem);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDataById = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        refreshCoursesData: fetchData,
        getCourseById: fetchDataById,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);

  if (!context)
    throw new Error("useCourses must be used within CourseProvider");

  return context;
};
