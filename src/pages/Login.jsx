import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { getMyProfile } from "@/api/endpoints";
import { handleGoogleSignIn } from "@/utils/handleGoogleSignIn";
import GoogleIcon from "@/components/ui/GoogleIcon";
import BrandingPanel from "@/components/auth/BrandingPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import "@/styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: form.email,
          password: form.password,
        },
      );
      if (authError) throw authError;

      const { data: profile } = await getMyProfile();
      setAuth({ ...data.user, ...profile }, data.session);
      navigate("/");
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Credenciales inválidas. Por favor, inténtalo de nuevo."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-login">
      <BrandingPanel
        title={
          <>
            Aprende Java
            <br />
            Sube de nivel
            <br />
            Cada día
          </>
        }
        subtitle="Domina la programación en Java a través de lecciones interactivas, ejecución de código en tiempo real y desafíos diarios diseñados para convertirte en un profesional."
      />

      <AuthLayout
        title="¡Bienvenido de nuevo!"
        subtitle="Inicia sesión para continuar tu viaje de aprendizaje."
        error={error}
      >
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="nombre@empresa.com"
              value={form.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <div className="flex justify-between items-center">
              <label className="auth-label">Contraseña</label>
              <button
                type="button"
                className="text-xs font-bold text-[#6324eb] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <PasswordInput
              password={form.password}
              placeholder="••••••••"
              handleChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button-primary"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">o</span>
          <div className="auth-divider-line" />
        </div>

        <button onClick={handleGoogleSignIn} className="auth-button-google">
          <GoogleIcon />
          Continuar con Google
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-bold text-[#6324eb] hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </AuthLayout>
    </div>
  );
}
