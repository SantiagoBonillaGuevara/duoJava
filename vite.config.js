import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development, production, etc.)
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url))); // Carga las variables de entorno desde el directorio raíz

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // Permite usar "@" como alias para la carpeta "src" en las importaciones
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // Usa la variable de entorno para la URL del backend
          changeOrigin: true, // Cambia el origen de la solicitud para evitar problemas de CORS
        },
      },
    },
  };
});
