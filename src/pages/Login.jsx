import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase, signInWithGoogle } from "@/lib/supabase";
import { getMyProfile } from "@/api/endpoints";
import GoogleIcon from "@/components/ui/GoogleIcon";
import BrandingPanel from "@/components/auth/BrandingPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import "@/styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;

      const { data: profile } = await getMyProfile();
      setAuth({ ...data.user, ...profile }, data.session);
      navigate("/");
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "Credenciales inválidas. Por favor, inténtalo de nuevo." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-login">
      <BrandingPanel
        title={<>Aprende Java.<br />Sube de nivel.<br />Cada día.</>}
        subtitle="Domina la programación en Java a través de lecciones interactivas, ejecución de código en tiempo real y desafíos diarios diseñados para convertirte en un profesional."
      >
        <div className="code-card-container rotate-2 hover:rotate-0">
          <div className="flex gap-1.5 mb-4">
            <div className="code-dot bg-red-500" />
            <div className="code-dot bg-yellow-500" />
            <div className="code-dot bg-green-500" />
          </div>
          <code className="text-sm font-mono block text-slate-300">
            <span className="text-[#6324eb]">public class</span>{" "}
            <span className="text-yellow-400">Main</span> {"{"}
            <br />
            &nbsp;&nbsp;
            <span className="text-[#6324eb]">public static void</span>{" "}
            <span className="text-blue-400">main</span>(String[] args) {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(
            <span className="text-green-400">"Keep coding!"</span>);
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            {"}"}
          </code>
        </div>
      </BrandingPanel>

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
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
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

        <button
          onClick={handleGoogleSignIn}
          className="auth-button-google"
        >
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
