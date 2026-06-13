import { useState, useEffect } from "react";
import { signOut } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { getLevels } from "@/api/endpoints";

// Components
import Sidebar from "@/components/dashboard/Sidebar";

// Styles
import "@/styles/dashboard.css";
import "@/styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, session } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const { data } = await getLevels();
        const sortedLevels = data.sort((a, b) => a.levelNumber - b.levelNumber);
        setLevels(sortedLevels);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      logout();
      navigate("/login");
    }
  };

  const currentLevelNumber = user?.levelNumber || 1;
  const currentLevel = levels.find((l) => l.levelNumber === currentLevelNumber);

  const memberSince = session?.user?.created_at
    ? new Date(session.user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : "Recientemente";

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Mi Perfil
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#6324eb]/10 text-[#6324eb] px-4 py-2 rounded-full font-bold text-sm">
                <span className="material-symbols-outlined filled-icon text-lg">
                  bolt
                </span>
                {user?.xp || 0} XP
              </div>
            </div>
          </header>

          {/* User Hero Header */}
          <section className="profile-hero mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="profile-avatar-container group">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar flex items-center justify-center bg-[#6324eb]/20 text-[#6324eb] text-4xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                  {user?.displayName}
                </h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mb-4">
                  @{user?.username}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">
                    calendar_today
                  </span>
                  <span className="text-sm font-medium">
                    Miembro desde {memberSince}
                  </span>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="status-badge flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Compilando habilidades
                </div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="stats-grid mb-12">
            {/* Streak */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-orange-500 filled-icon">
                  local_fire_department
                </span>
                <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Activo
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Racha Actual
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {user?.streak || 0}{" "}
                <span className="text-lg font-bold text-slate-500">días</span>
              </p>
            </div>

            {/* Total XP */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-blue-500 filled-icon">
                  military_tech
                </span>
                <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Total
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Experiencia Total
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {(user?.xp || 0).toLocaleString()}
              </p>
            </div>

            {/* Rank */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-purple-500 filled-icon">
                  school
                </span>
                <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Rango
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Nivel Actual
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white truncate">
                {loading ? "Cargando..." : currentLevel?.title || "Novato"}
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#6324eb] h-full transition-all duration-500"
                  style={{
                    width: `${(user?.levelNumber / (levels.length || 10)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Lessons */}
            <div className="stat-card group">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined stat-icon text-emerald-500 filled-icon">
                  task_alt
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                Lecciones Completas
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {user?.completedLessons || 0}
              </p>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6324eb] filled-icon">
                  auto_awesome
                </span>
                Logros Obtenidos
              </h3>
              <button className="text-[#6324eb] font-bold text-sm hover:underline">
                Ver todos
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
              {/* Achievement 1 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-blue-500 to-indigo-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    repeat
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Loop Master
                </p>
              </div>

              {/* Achievement 2 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-emerald-400 to-teal-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    terminal
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Syntax Ninja
                </p>
              </div>

              {/* Achievement 3 */}
              <div className="achievement-badge">
                <div className="achievement-icon-container bg-gradient-to-br from-purple-500 to-pink-600">
                  <span className="material-symbols-outlined text-4xl text-white">
                    data_object
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  First Program
                </p>
              </div>

              {/* Locked 1 */}
              <div className="achievement-badge achievement-locked">
                <div className="achievement-icon-container bg-slate-200 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">
                    lock
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                  Algorithm Ace
                </p>
              </div>

              {/* Locked 2 */}
              <div className="achievement-badge achievement-locked">
                <div className="achievement-icon-container bg-slate-200 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600">
                    lock
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                  Thread Titan
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
