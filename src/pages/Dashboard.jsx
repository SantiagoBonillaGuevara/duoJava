import { useState, useEffect } from "react";
import { signOut } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { getLevels } from "@/api/endpoints";

// Componentes extraídos para mantener Dashboard limpio
const NavItem = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-colors ${
      active
        ? "bg-[#6324eb]/10 text-[#6324eb]"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <span
      className={`material-symbols-outlined ${active ? "filled-icon" : ""}`}
    >
      {icon}
    </span>
    {label}
  </Link>
);

const ActivityItem = ({ icon, iconBg, iconColor, title, subtitle }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
    <div
      className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
    >
      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {subtitle}
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const { data } = await getLevels();
        // Ordenar niveles por número por si acaso
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
      await signOut(); // 1. invalida token en Supabase + limpia localStorage del SDK
      logout(); // 2. limpia el store de Zustand
      navigate("/login"); // 3. redirige
    } catch (err) {
      console.error("Logout error:", err);
      // Aunque falle Supabase, limpiar el store igual
      logout();
      navigate("/login");
    }
  };

  // Calcular XP para la barra de progreso usando datos de la API
  const currentLevelNumber = user?.levelNumber || 1;
  const currentLevel = levels.find((l) => l.levelNumber === currentLevelNumber);
  const nextLevel = levels.find(
    (l) => l.levelNumber === currentLevelNumber + 1,
  );

  let xpProgress = 0;
  let xpRequiredForNext = 0;
  let isMaxLevel = false;

  if (loading) {
    xpProgress = 0;
  } else if (!nextLevel && levels.length > 0) {
    isMaxLevel = true;
    xpProgress = 100;
  } else if (currentLevel && nextLevel) {
    const minXp = currentLevel.xpRequired;
    const maxXp = nextLevel.xpRequired;
    const userXp = user?.xp || 0;

    const range = maxXp - minXp;
    const progressInRange = userXp - minXp;

    xpProgress = Math.max(0, Math.min((progressInRange / range) * 100, 100));
    xpRequiredForNext = maxXp;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#161121]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-[#6324eb] rounded-lg p-1.5 flex items-center justify-center">
              <Logo className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              duoJava
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            <NavItem icon="home" label="Home" to="/" active />
            <NavItem icon="menu_book" label="Lessons" to="/lessons" />
            <NavItem icon="leaderboard" label="Leaderboard" to="/leaderboard" />
            <NavItem icon="person" label="Profile" to="/profile" />
          </nav>
        </div>

        {/* User card */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="relative flex-shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#6324eb]/20 flex items-center justify-center text-[#6324eb] font-bold text-sm">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-[#F97316] text-[10px] font-bold text-white px-1 rounded-full border-2 border-white dark:border-[#1E293B]">
                L{user?.levelNumber}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.displayName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                @{user?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="ml-auto text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {user?.displayName?.split(" ")[0]}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Ready to master some Java today?
              </p>
            </div>
            {user?.streak > 0 && (
              <div className="flex items-center bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-2 rounded-full">
                <span className="text-[#F97316] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined filled-icon">
                    local_fire_department
                  </span>
                  {user.streak} Day Streak
                </span>
              </div>
            )}
          </header>

          {/* XP Progress */}
          <section className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Badge Icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
                style={{
                  backgroundColor: `${currentLevel?.badgeColor || "#6324eb"}15`,
                  border: `1px solid ${currentLevel?.badgeColor || "#6324eb"}30`,
                }}
              >
                <span
                  className="material-symbols-outlined text-4xl filled-icon"
                  style={{ color: currentLevel?.badgeColor || "#6324eb" }}
                >
                  {currentLevel?.badgeIcon || "military_tech"}
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isMaxLevel && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
                          Master
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {currentLevel?.title || `Level ${user?.levelNumber}`}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {currentLevel?.description ||
                        "Continue your journey to unlock more rewards."}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-start sm:items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Total Experience
                    </span>
                    <span 
                      className="text-xl font-black"
                      style={{ color: currentLevel?.badgeColor || '#6324eb' }}
                    >
                      {user?.xp || 0}{" "}
                      <span className="text-slate-300 dark:text-slate-700 mx-1">
                        /
                      </span>{" "}
                      {isMaxLevel ? "MAX" : xpRequiredForNext}
                      <span className="text-sm ml-1 text-slate-400">XP</span>
                    </span>
                  </div>
                  </div>

                  <div className="space-y-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-1">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{
                        width: `${xpProgress}%`,
                        backgroundColor: currentLevel?.badgeColor || "#6324eb",
                        backgroundImage:
                          "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                        backgroundSize: "1rem 1rem",
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    <span>{isMaxLevel ? currentLevel?.title || "Max Level" : `Level ${user?.levelNumber || 1}`}</span>
                    <span style={{ color: currentLevel?.badgeColor || '#6324eb' }}>
                      {isMaxLevel ? "100% Completed" : `${Math.round(xpProgress)}% Completed`}
                    </span>
                    <span>{isMaxLevel ? "Master" : `Level ${nextLevel?.levelNumber || (user?.levelNumber || 1) + 1}`}</span>
                  </div>
                  </div>

              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Challenge Banner */}
              <div className="bg-gradient-to-r from-[#F97316] to-orange-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shadow-[#F97316]/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <span className="material-symbols-outlined text-3xl">
                      bolt
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Daily Challenge</h3>
                    <p className="text-orange-50 font-medium">
                      +50 XP available today
                    </p>
                  </div>
                </div>
                <button className="bg-white text-[#F97316] px-6 py-2 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-sm">
                  Start Now
                </button>
              </div>

              {/* Course Card */}
              <div className="group relative bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-video w-full bg-[#6324eb]/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6324eb]/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-8xl text-[#6324eb]/40">
                      code
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#6324eb] border border-[#6324eb]/20">
                    JAVA CORE
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        Java Fundamentals
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                        Master the basics of syntax, loops, and variables
                        through interactive coding puzzles.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#6324eb]">
                        60%
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex-1 bg-[#6324eb] text-white py-3.5 rounded-2xl font-bold hover:bg-[#6324eb]/90 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined filled-icon">
                        play_arrow
                      </span>
                      Continue Learning
                    </button>
                    <button className="p-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
                <button className="text-xs font-bold text-[#6324eb] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <ActivityItem
                  icon="check_circle"
                  iconBg="bg-green-500/10"
                  iconColor="text-green-500"
                  title="Completed: While Loops"
                  subtitle="Earned 15 XP • 2h ago"
                />
                <ActivityItem
                  icon="emoji_events"
                  iconBg="bg-[#6324eb]/10"
                  iconColor="text-[#6324eb]"
                  title="New Achievement!"
                  subtitle="Logic Master Tier 1 • 5h ago"
                />
                <ActivityItem
                  icon="local_fire_department"
                  iconBg="bg-[#F97316]/10"
                  iconColor="text-[#F97316]"
                  title="Streak Extended"
                  subtitle={`Reached ${user?.streak || 0} day milestone • Yesterday`}
                />
              </div>

              {/* Promo card */}
              <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg leading-tight">
                    Join the Weekend Tournament
                  </h4>
                  <p className="text-indigo-100 text-xs mt-2">
                    Compete with 200 others for the Top 10 spot.
                  </p>
                  <button className="mt-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                    View Leaderboard
                  </button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
