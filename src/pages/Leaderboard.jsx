import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getLeaderboard } from "@/api/endpoints";

// Components
import Sidebar from "@/components/nav/Sidebar";

// Styles
import "@/styles/dashboard.css";
import "@/styles/leaderboard.css";

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);
  const currentUserRank = leaderboardData.find((u) => u.userId === user?.id);

  // Reorganize top three for podium (2, 1, 3)
  const podiumItems = [
    topThree[1] || null, // 2nd
    topThree[0] || null, // 1st
    topThree[2] || null, // 3rd
  ];

  return (
    <div className="leaderboard-container">
      <Sidebar user={user} />

      <main className="leaderboard-main">
        <div className="leaderboard-content-wrapper">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
            <div>
              <p className="text-[#6324eb] font-bold text-xs uppercase tracking-widest mb-1">
                Liga de Diamante
              </p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Los Mejores Compiladores
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#6324eb]/10 text-[#6324eb] px-4 py-2 rounded-full font-bold text-sm">
                <span className="material-symbols-outlined filled-icon text-lg">
                  leaderboard
                </span>
                Histórico
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6324eb]"></div>
            </div>
          ) : (
            <>
              {/* Podium Section */}
              <section className="podium-section !px-0">
                <div className="podium-container">
                  {podiumItems.map((item, index) => {
                    if (!item) return <div key={index} />;

                    const isFirst = index === 1;
                    const isSecond = index === 0;
                    const isThird = index === 2;

                    let rankColor = "#FFD700"; // Gold
                    let shadowClass = "podium-shadow-gold";
                    let label = "ORO";
                    let sizeClass = isFirst ? "w-32 h-32" : "w-20 h-20";
                    let baseHeight = isFirst
                      ? "h-40"
                      : isSecond
                        ? "h-24"
                        : "h-20";
                    let topClass = isFirst ? "-top-8" : "top-0";

                    if (isSecond) {
                      rankColor = "#C0C0C0";
                      shadowClass = "podium-shadow-silver";
                      label = "PLATA";
                    } else if (isThird) {
                      rankColor = "#CD7F32";
                      shadowClass = "podium-shadow-bronze";
                      label = "BRONCE";
                    }

                    return (
                      <div
                        key={item.userId}
                        className={`podium-item group ${topClass}`}
                      >
                        {isFirst && (
                          <span className="material-symbols-outlined text-[#FFD700] mb-2 animate-bounce filled-icon">
                            workspace_premium
                          </span>
                        )}
                        <div
                          className={`podium-avatar-wrapper group-hover:scale-105 ${shadowClass}`}
                        >
                          <div
                            className={`${sizeClass} podium-avatar`}
                            style={{ borderColor: rankColor }}
                          >
                            {item.avatarUrl ? (
                              <img
                                src={item.avatarUrl}
                                alt={item.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-xl">
                                {item.displayName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div
                            className="podium-rank-badge"
                            style={{
                              backgroundColor: rankColor,
                              color: "#1e293b",
                            }}
                          >
                            {item.rank}
                          </div>
                        </div>
                        <p
                          className={`font-bold text-slate-900 dark:text-white truncate max-w-full px-2 ${isFirst ? "text-xl" : "text-base"}`}
                        >
                          {item.displayName}
                        </p>
                        <p className="text-xs font-bold text-[#6324eb] uppercase tracking-wider">
                          {item.xp.toLocaleString()} XP
                        </p>
                        <div
                          className={`podium-base ${baseHeight} bg-gradient-to-t ${isFirst ? "from-[#6324eb]/20 to-[#6324eb]/40" : "from-slate-100 to-slate-200 dark:from-slate-800/40 dark:to-slate-800"}`}
                        >
                          <span
                            className="text-[10px] font-black tracking-[0.2em] mb-4"
                            style={{ color: rankColor }}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Current User Highlight */}
              {currentUserRank && (
                <section className="mb-6">
                  <div className="user-rank-highlight !max-w-none">
                    <div className="z-10 flex items-center gap-6">
                      <div className="text-[#6324eb] font-black text-3xl px-6 border-r border-slate-200 dark:border-slate-800">
                        #{currentUserRank.rank}
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-[#6324eb] overflow-hidden bg-white dark:bg-slate-800">
                        {currentUserRank.avatarUrl ? (
                          <img
                            src={currentUserRank.avatarUrl}
                            alt={currentUserRank.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6324eb] font-bold">
                            {currentUserRank.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {currentUserRank.displayName} (Tú)
                        </p>
                        <p className="text-[10px] font-black text-[#6324eb] uppercase tracking-widest">
                          NIVEL {currentUserRank.levelNumber} •{" "}
                          {currentUserRank.levelTitle}
                        </p>
                      </div>
                    </div>
                    <div className="z-10 bg-white dark:bg-slate-800/50 px-6 py-3 rounded-2xl border border-[#6324eb]/20 ml-auto text-center">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                        Tu XP Total
                      </p>
                      <p className="font-black text-xl text-[#6324eb]">
                        {currentUserRank.xp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Global Table Section */}
              <section className="global-table-container !px-0 !pb-0 min-h-[400px]">
                <div className="leaderboard-table-wrapper !max-w-none">
                  <div className="table-header">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Rango
                    </span>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Usuario
                    </span>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Insignia
                    </span>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                      Total XP
                    </span>
                  </div>

                  <div className="overflow-y-visible">
                    {others.map((item) => (
                      <div key={item.userId} className="table-row group">
                        <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#6324eb] transition-colors">
                          {item.rank.toString().padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {item.avatarUrl ? (
                              <img
                                src={item.avatarUrl}
                                alt={item.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                {item.displayName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {item.displayName}
                          </span>
                        </div>
                        <div>
                          <span
                            className="badge-tag"
                            style={{
                              backgroundColor: `${item.badgeColor}15`,
                              color: item.badgeColor,
                              borderColor: `${item.badgeColor}30`,
                            }}
                          >
                            {item.badgeIcon} {item.levelTitle}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-right">
                          {item.xp.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {others.length === 0 && (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                        No hay más compiladores en el ranking aún...
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
