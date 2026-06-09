import { useState, useEffect } from "react";
import { signOut } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { getLevels, getCurrentCourse } from "@/api/endpoints";

// Dashboard Components
import Sidebar from "@/components/dashboard/Sidebar";
import XPProgress from "@/components/dashboard/XPProgress";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import CourseCard from "@/components/dashboard/CourseCard";
import RecentActivity from "@/components/dashboard/RecentActivity";

// Styles
import "@/styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

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

    const fetchCurrentCourse = async () => {
      try {
        setCourseLoading(true);
        const { data } = await getCurrentCourse();
        setCurrentCourse(data);
        setCourseError(null);
      } catch (error) {
        if (error.response?.status === 404) {
          setCourseError(
            error.response.data?.detail || "No hay cursos disponibles",
          );
        } else {
          console.error("Error fetching course:", error);
          setCourseError("Error al cargar el curso");
        }
      } finally {
        setCourseLoading(false);
      }
    };

    fetchLevels();
    fetchCurrentCourse();
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

  // Logic for XP Progress
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
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ¡Bienvenido de nuevo, {user?.displayName?.split(" ")[0]}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                ¿Listo para dominar Java hoy?
              </p>
            </div>
            {user?.streak > 0 && (
              <div className="flex items-center bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-2 rounded-full w-fit">
                <span className="text-[#F97316] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined filled-icon">
                    local_fire_department
                  </span>
                  {user.streak} días de racha
                </span>
              </div>
            )}
          </header>

          <XPProgress
            currentLevel={currentLevel}
            user={user}
            isMaxLevel={isMaxLevel}
            xpRequiredForNext={xpRequiredForNext}
            xpProgress={xpProgress}
            nextLevel={nextLevel}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DailyChallenge />
              <CourseCard
                course={currentCourse}
                loading={courseLoading}
                error={courseError}
              />
            </div>

            <RecentActivity user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
