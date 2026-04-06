import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios";

const DuoJavaLogo = () => (
  <svg className="size-full" fill="none" viewBox="0 0 48 48">
    <path
      d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
      fill="currentColor"
    />
  </svg>
);

export default function SetupUsername() {
  const navigate = useNavigate();
  const { session, user, setAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verificar disponibilidad con debounce — esta sí puede ir directo
  // a Supabase porque es solo una consulta pública de disponibilidad
  // sin exponer datos sensibles
  useEffect(() => {
    if (username.length < 3) {
      setAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        // Verificar disponibilidad por Spring Boot
        const { data } = await api.get(
          `/users/username-available?username=${username}`,
        );
        setAvailable(data.available);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!available) return;
    setLoading(true);
    try {
      // Actualizar username por Spring Boot
      const { data: profile } = await api.patch("/users/me", { username });

      // Actualizar el store con el perfil actualizado
      setAuth({ ...user, ...profile }, session);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
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
            <DuoJavaLogo />
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
                    setAvailable(null);
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
