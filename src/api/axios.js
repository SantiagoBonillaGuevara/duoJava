import axios from "axios";

const api = axios.create({
  // Crea una instancia de Axios con la configuración base
  baseURL: import.meta.env.VITE_API_URL, // Usa la variable de entorno para la URL del backend
  headers: { "Content-Type": "application/json" }, // Configura el encabezado para enviar JSON
});

api.interceptors.request.use((config) => {
  // Interceptor para agregar el token de autenticación a cada solicitud
  const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local
  if (token) config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado de autorización si existe
  return config;
});

api.interceptors.response.use(
  // Interceptor para manejar respuestas y errores globalmente
  (res) => res, // Devuelve la respuesta sin modificar si es exitosa
  (error) => {
    // Maneja errores, especialmente el error 401 (no autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Elimina el token del almacenamiento local si la respuesta es 401
      window.location.href = "/login"; // Redirige al usuario a la página de inicio de sesión
    }
    return Promise.reject(error); // Rechaza la promesa con el error para que pueda ser manejado por el código que hizo la solicitud
  },
);

export default api;
