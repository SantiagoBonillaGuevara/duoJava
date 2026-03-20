import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  // Crea un store de Zustand para manejar la autenticación del usuario
  persist(
    // Middleware para persistir el estado en el almacenamiento local del navegador
    (set) => ({
      // Estado inicial del store
      user: null,
      token: null,
      setAuth: (user, token) => {
        // Función para establecer la autenticación del usuario, guardando el token en el almacenamiento local y actualizando el estado
        localStorage.setItem("token", token);
        set({ user, token });
      },
      logout: () => {
        // Función para cerrar sesión, eliminando el token del almacenamiento local y restableciendo el estado
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    { name: "auth-storage" }, // Nombre para el almacenamiento persistente, se usará como clave en localStorage
  ),
);
