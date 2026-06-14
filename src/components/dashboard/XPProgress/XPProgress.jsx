import XPProgressLoading from "./XPProgressLoading";
import BadgeIcon from "./BadgeIcon";

const XPProgress = ({
  currentLevel,
  user,
  isMaxLevel,
  xpRequiredForNext,
  xpProgress,
  nextLevel,
  loading,
}) => {
  if (loading) return <XPProgressLoading />;

  return (
    <section className="xp-section">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <BadgeIcon currentLevel={currentLevel} />

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isMaxLevel && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
                    Maestro
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {currentLevel?.title || `Nivel ${user?.levelNumber}`}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {currentLevel?.description ||
                  "Continúa tu viaje para desbloquear más recompensas."}
              </p>
            </div>
            <div className="text-right flex flex-col items-start sm:items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Experiencia Total
              </span>
              <span
                className="text-xl font-black"
                style={{ color: currentLevel?.badgeColor || "#6324eb" }}
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
            <div className="progress-bar-container">
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
              <span>
                {isMaxLevel
                  ? currentLevel?.title || "Nivel Máximo"
                  : `Nivel ${user?.levelNumber || 1}`}
              </span>
              <span style={{ color: currentLevel?.badgeColor || "#6324eb" }}>
                {isMaxLevel
                  ? "100% Completado"
                  : `${Math.round(xpProgress)}% Completado`}
              </span>
              <span>
                {isMaxLevel
                  ? "Maestro"
                  : `Nivel ${nextLevel?.levelNumber || (user?.levelNumber || 1) + 1}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default XPProgress;
