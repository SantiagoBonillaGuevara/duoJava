import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";
import "@/styles/auth.css";

export default function SetupUsername() {
  const navigate = useNavigate();
  const { session, user, setAuth, logout } = useAuthStore();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { available, checking } = useUsernameCheck(username);

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      navigate("/login");
      return;
    }

    if (user?.username) {
      navigate("/dashboard");
    }
  }, [session, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!available || checking) return;
    setLoading(true);
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        logout();
        navigate("/login");
        return;
      }
      const { error: updateError, data: updated } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", currentSession.user.id)
        .select("username")
        .single();

      if (updateError) throw updateError;

      if (!updated?.username) {
        throw new Error(
          "No se pudo guardar el nombre de usuario. Por favor, inténtalo de nuevo.",
        );
      }

      setAuth(
        {
          ...user,
          username,
        },
        currentSession,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161121] p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 text-white mb-10 justify-center">
          <div className="size-8 text-[#6324eb]">
            <Logo />
          </div>
          <h2 className="text-2xl font-black tracking-tight">duoJava</h2>
        </div>

        <div className="auth-card !max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">
            Elige tu nombre de usuario
          </h2>
          <p className="text-slate-400 mb-8">
            Así es como otros estudiantes te encontrarán.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-900/20 border border-red-800 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="auth-input-group">
              <label className="text-sm font-medium text-slate-300">
                Nombre de usuario
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 select-none">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    );
                  }}
                  placeholder="usuario"
                  required
                  minLength={3}
                  maxLength={20}
                  className="auth-input pl-9 pr-10"
                />
                <span className="absolute right-3 material-symbols-outlined text-xl">
                  {checking ? (
                    <span className="text-slate-400 text-sm animate-spin">
                      sync
                    </span>
                  ) : available === true ? (
                    <span className="text-emerald-500">check_circle</span>
                  ) : available === false ? (
                    <span className="text-red-500">cancel</span>
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

            <button
              type="submit"
              disabled={!available || loading}
              className="auth-button-primary"
            >
              {loading ? "Guardando..." : "Continuar →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
