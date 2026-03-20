import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  // Configuración global para React Query, estableciendo opciones predeterminadas para las consultas como el número de reintentos y el tiempo de caché
  defaultOptions: {
    // Opciones predeterminadas para todas las consultas de React Query
    queries: {
      retry: 1, // Reintenta una vez en caso de error antes de marcar la consulta como fallida
      staleTime: 1000 * 60 * 5, // 5 minutos de caché antes de que los datos se consideren obsoletos y se vuelvan a cargar automáticamente al acceder a la consulta nuevamente
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // Renderiza la aplicación React en el elemento con id "root" en el DOM
  <React.StrictMode>
    {" "}
    {/* Modo estricto de React para ayudar a identificar problemas potenciales en la aplicación durante el desarrollo */}
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* Proveedor de React Query que hace que el cliente de consultas esté disponible en toda la aplicación */}
      <BrowserRouter>
        {" "}
        {/* Proveedor de React Router que habilita el enrutamiento en la aplicación */}
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
