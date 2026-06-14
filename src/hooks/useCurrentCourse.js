import { useState, useEffect } from "react";
import { getCurrentCourse } from "@/api/endpoints";

export function useCurrentCourse() {
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  useEffect(() => {
    const fetchCurrentCourse = async () => {
      try {
        setCourseLoading(true);
        const { data } = await getCurrentCourse();
        setCurrentCourse(data);
        setCourseError(null);
      } catch (error) {
        if (error.response?.status === 404) {
          setCourseError(
            error.response.data?.detail || "No hay cursos disponibles",
          );
        } else {
          setCourseError("Error al cargar el curso");
        }
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCurrentCourse();
  }, []);

  return { currentCourse, courseLoading, courseError };
}
