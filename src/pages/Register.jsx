import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { handleGoogleSignIn } from "@/utils/handleGoogleSignIn";
import GoogleIcon from "@/components/ui/GoogleIcon";
import BrandingPanel from "@/components/auth/BrandingPanel";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import "@/styles/auth.css";

import { passwordStrength, strengthColors } from "@/utils/password";

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
      />

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
            <PasswordInput
              password={form.password}
              placeholder="Crea una contraseña"
              handleChange={handleChange}
            />
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
