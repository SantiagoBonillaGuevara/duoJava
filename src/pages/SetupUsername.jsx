import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";

export default function SetupUsername() {
  const navigate = useNavigate();
  const { session, user, setAuth, logout } = useAuthStore();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { available, checking } = useUsernameCheck(username);

  useEffect(() => {
    // Esperar a que el store hidrate antes de redirigir
    if (session === undefined) return; // todavía cargando

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
      // Verificar sesión vigente antes de intentar guardar
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        // Sesión expirada → limpiar store y mandar al login
        logout();
        navigate("/login");
        return;
      }
      const { error: updateError, data: updated } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", currentSession.user.id) // ✅ sesión fresca, no el store
        .select("username")
        .single();

      if (updateError) throw updateError;

      // Confirmar que realmente se escribió en BD
      if (!updated?.username) {
        throw new Error("Could not save username. Please try again.");
      }

      // Actualizar store con username nuevo
      setAuth(
        {
          id: user.id,
          email: user.email,
          username, // el nuevo
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          xp: user.xp,
          levelNumber: user.levelNumber,
          streak: user.streak,
        },
        currentSession,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
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

        <div className="bg-[#1E293B] rounded-2xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-2">
            Choose your username
          </h2>
          <p className="text-slate-400 mb-8">
            This is how other learners will find you.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-900/20 border border-red-800 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">
                Username
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
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full pl-9 pr-10 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
                />
                <span className="absolute right-3 material-symbols-outlined text-xl">
                  {checking ? (
                    <span className="text-slate-400 text-sm">...</span>
                  ) : available === true ? (
                    <span className="text-emerald-500">check_circle</span>
                  ) : available === false ? (
                    <span className="text-red-500">cancel</span>
                  ) : null}
                </span>
              </div>
              {available === false && (
                <p className="text-xs text-red-400">Username already taken</p>
              )}
              {available === true && (
                <p className="text-xs text-emerald-400">Username available!</p>
              )}
              <p className="text-xs text-slate-500">
                Only letters, numbers and underscores. 3-20 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={!available || loading}
              className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? "Saving..." : "Continue →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
