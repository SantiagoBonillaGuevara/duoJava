import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Lesson from "@/pages/Lesson";
import Exercise from "@/pages/Exercise";
import Profile from "@/pages/Profile";

const ProtectedRoute = ({ children }) => {
  // Componente para proteger rutas que requieren autenticación
  const token = useAuthStore((s) => s.token); // Obtiene el token de autenticación del estado global usando Zustand
  return token ? children : <Navigate to="/login" replace />; // Si el token existe, renderiza los hijos (la ruta protegida), de lo contrario redirige a la página de inicio de sesión
};

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lesson/:id"
        element={
          <ProtectedRoute>
            <Lesson />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercise/:id"
        element={
          <ProtectedRoute>
            <Exercise />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
