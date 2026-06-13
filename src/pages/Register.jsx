import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, signInWithGoogle } from "@/lib/supabase";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import GoogleIcon from "@/components/ui/GoogleIcon";
import BrandingPanel from "@/components/auth/BrandingPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import "@/styles/auth.css";

const passwordStrength = (password) => {
  if (!password) return { label: "", color: "", width: "0%" };
  if (password.length < 6)
    return { label: "Débil", color: "bg-red-500", width: "25%" };
  if (password.length < 10)
    return { label: "Aceptable", color: "bg-yellow-500", width: "50%" };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: "Buena", color: "bg-blue-500", width: "75%" };
  return { label: "Fuerte", color: "bg-emerald-500", width: "100%" };
};

const strengthColors = {
  Débil: "text-red-500",
  Aceptable: "text-yellow-500",
  Buena: "text-blue-500",
  Fuerte: "text-emerald-500",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { available, checking } = useUsernameCheck(form.username);
  const strength = passwordStrength(form.password);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!available) {
      setError("Por favor, elige un nombre de usuario disponible.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            display_name: form.displayName,
            username: form.username,
          },
        },
      });
      if (signUpError) throw signUpError;
      if (data?.user?.identities?.length === 0) {
        setError(
          "Ya existe una cuenta con este correo. Por favor, inicia sesión.",
        );
        return;
      }
      navigate("/login");
    } catch (err) {
      setError(err.message || "Algo salió mal. Por favor, inténtalo de nuevo.");
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

  const benefits = [
    { icon: "code", text: "Ejercicios de programación interactivos" },
    { icon: "emoji_events", text: "Gana XP y desbloquea logros" },
    { icon: "show_chart", text: "Sigue tu progreso visualmente" },
  ];

  return (
    <div className="auth-page-register">
      <BrandingPanel
        title="Comienza tu racha hoy 🔥"
        subtitle="Únete a la plataforma gamificada de aprendizaje de Java diseñada para desarrolladores modernos."
        benefits={benefits}
      >
        <div className="code-card-container border-slate-700/50 rotate-1 hover:rotate-0">
          <div className="flex gap-1.5 mb-4">
            <div className="code-dot bg-red-500/50" />
            <div className="code-dot bg-amber-500/50" />
            <div className="code-dot bg-emerald-500/50" />
          </div>
          <pre className="font-mono text-sm">
            <span className="text-purple-400">public class</span>{" "}
            <span className="text-amber-300">DuoJava</span> {"{\n"}
            {"  "}
            <span className="text-purple-400">public static void</span>{" "}
            <span className="text-blue-400">main</span>(String[] args) {"{\n"}
            {"    "}System.out.println(
            <span className="text-emerald-400">"Hello Coder!"</span>);{"\n"}
            {"    "}
            <span className="text-slate-500">
              {"// Your journey begins..."}
            </span>
            {"\n"}
            {"  }"}
            {"\n"}
            {"}"}
          </pre>
        </div>
      </BrandingPanel>

      <AuthLayout
        title="Crea tu cuenta"
        subtitle="Gratis para siempre. Sin tarjeta de crédito."
        error={error}
        useCard={true}
      >
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Nombre a mostrar</label>
            <input
              name="displayName"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={form.displayName}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Nombre de usuario</label>
            <div className="relative flex items-center">
              <input
                name="username"
                type="text"
                placeholder="@ usuario"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ""),
                  })
                }
                required
                minLength={3}
                maxLength={20}
                className="auth-input pl-9 pr-10"
              />
              <span className="absolute right-3 text-xl">
                {checking ? (
                  <span className="text-slate-400 material-symbols-outlined text-base animate-spin">
                    sync
                  </span>
                ) : available === true ? (
                  <span className="text-emerald-500 material-symbols-outlined">
                    check_circle
                  </span>
                ) : available === false ? (
                  <span className="text-red-500 material-symbols-outlined">
                    cancel
                  </span>
                ) : null}
              </span>
            </div>
            {available === false && (
              <p className="text-xs text-red-400">
                Nombre de usuario ya ocupado
              </p>
            )}
            {available === true && (
              <p className="text-xs text-emerald-400">
                ¡Nombre de usuario disponible!
              </p>
            )}
            <p className="text-xs text-slate-500">
              Solo letras, números y guiones bajos. 3-20 caracteres.
            </p>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Correo electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Contraseña</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crea una contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {form.password && (
              <div className="flex flex-col gap-1 mt-2">
                <div className="password-strength-meter">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <span
                  className={`password-strength-text ${strengthColors[strength.label]}`}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button-primary"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">o</span>
          <div className="auth-divider-line" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="auth-button-google bg-transparent"
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-[#6324eb] font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </AuthLayout>
    </div>
  );
}
