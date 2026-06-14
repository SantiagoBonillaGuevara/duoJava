import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getLevels } from "@/api/endpoints";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
// Components
import Sidebar from "@/components/nav/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import XPProgress from "@/components/dashboard/XPProgress/XPProgress";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import CourseCard from "@/components/dashboard/CourseCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
// Styles
import "@/styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentCourse, courseLoading, courseError } = useCurrentCourse();

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
      <Sidebar user={user} />
      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content-wrapper">
          <DashboardHeader user={user} />
          <XPProgress
            currentLevel={currentLevel}
            user={user}
            isMaxLevel={isMaxLevel}
            xpRequiredForNext={xpRequiredForNext}
            xpProgress={xpProgress}
            nextLevel={nextLevel}
            loading={loading}
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
