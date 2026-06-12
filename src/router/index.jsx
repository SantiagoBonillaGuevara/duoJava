import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import SetupUsername from "@/pages/SetupUsername";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
/*import Lesson from "@/pages/Lesson";
import Exercise from "@/pages/Exercise";
import Profile from "@/pages/Profile";*/

const ProtectedRoute = ({ children }) => {
  const { session, user } = useAuthStore();

  if (!session) return <Navigate to="/login" replace />;

  // Solo redirige a setup-username desde rutas protegidas (dashboard, etc.)
  // No desde /auth/callback o /setup-username mismos
  if (!user?.username) return <Navigate to="/setup-username" replace />;

  return children;
};

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/setup-username" element={<SetupUsername />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      {/* 
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
      />*/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
