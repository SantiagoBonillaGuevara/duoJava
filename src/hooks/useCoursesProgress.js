import { useState, useEffect } from "react";
import { getCoursesProgress } from "../api/endpoints"; // Ajusta la ruta a tu API

export function useCoursesProgress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await getCoursesProgress();
        setCourses(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses progress:", err);
        setError("Error al cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Devolvemos los estados y funciones que el componente va a necesitar
  return { courses, loading, error };
}
