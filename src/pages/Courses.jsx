import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCoursesProgress } from "@/hooks/useCoursesProgress";

// Components
import Sidebar from "@/components/nav/Sidebar";

// Styles
import "@/styles/courses.css";

export default function Courses() {
  const { user } = useAuthStore();
  const { courses, loading, error } = useCoursesProgress();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [courses, searchTerm]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "COMPLETADO";
      case "IN_PROGRESS":
        return "EN PROGRESO";
      case "LOCKED":
        return "BLOQUEADO";
      default:
        return status;
    }
  };

  return (
    <div className="dashboard-container courses-container">
      <Sidebar user={user} />

      <main className="dashboard-main courses-main">
        <div className="dashboard-content-wrapper courses-content-wrapper">
          {/* Top Info Bar (Integrated, not fixed) */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-on-surface-variant">
                Cursos
              </span>
              <span className="material-symbols-outlined text-outline-variant text-sm">
                chevron_right
              </span>
              <span className="font-title-md text-primary font-bold">
                Selección
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant">
                <span className="material-symbols-outlined text-tertiary filled text-sm">
                  bolt
                </span>
                <span className="font-label-caps text-on-surface text-[10px]">
                  {user?.xp || 0} XP
                </span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant">
                <span className="material-symbols-outlined text-primary filled text-sm">
                  workspace_premium
                </span>
                <span className="font-label-caps text-on-surface text-[10px]">
                  {user?.streak || 0} Días
                </span>
              </div>
              <div className="relative">
                <input
                  className="bg-surface-container border-outline-variant text-on-surface rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:ring-primary focus:border-primary text-sm transition-all"
                  placeholder="Buscar cursos..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
              </div>
            </div>
          </header>

          {/* Hero Title */}
          <div className="mb-12">
            <h2 className="font-display-lg text-on-surface mb-3">
              Elige tu camino
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Domina la arquitectura de Java desde cero. Cada módulo compila tu
              lógica en habilidades profesionales.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-error-container/20 border border-error/50 p-6 rounded-xl text-center">
              <p className="text-error">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-surface-variant rounded-lg text-on-surface font-bold"
              >
                Reintentar
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-surface-container border border-outline-variant p-12 rounded-2xl text-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                inventory_2
              </span>
              <p className="text-on-surface-variant text-xl">
                No hay cursos disponibles en este momento.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-surface-container border border-outline-variant p-12 rounded-2xl text-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                search_off
              </span>
              <p className="text-on-surface-variant text-xl">
                No se encontraron cursos que coincidan con "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card rounded-xl p-6 flex flex-col relative overflow-hidden ${course.status === "LOCKED" ? "locked" : ""} ${course.status === "IN_PROGRESS" ? "border-2 !border-primary ring-4 ring-primary/10" : ""}`}
                >
                  {course.status === "COMPLETED" && (
                    <div className="absolute top-0 right-0 p-4">
                      <span className="material-symbols-outlined text-tertiary text-4xl filled">
                        check_circle
                      </span>
                    </div>
                  )}

                  {course.status === "IN_PROGRESS" && (
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                  )}

                  {course.status === "LOCKED" && (
                    <div className="absolute inset-0 bg-surface-dim/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 border border-outline-variant">
                        <span className="material-symbols-outlined text-outline text-3xl">
                          lock
                        </span>
                      </div>
                      <p className="font-label-caps text-on-surface-variant px-4">
                        Completa el curso anterior para desbloquear
                      </p>
                    </div>
                  )}

                  <div className="mb-6 flex justify-between items-start">
                    <span
                      className={`font-label-caps px-3 py-1 rounded-full border ${
                        course.status === "COMPLETED"
                          ? "text-tertiary bg-tertiary-container/20 border-tertiary/30"
                          : course.status === "IN_PROGRESS"
                            ? "text-on-primary-container bg-primary-container border-primary/30"
                            : "text-outline bg-surface-container border-outline-variant"
                      }`}
                    >
                      {getStatusLabel(course.status)}
                    </span>

                    {course.status === "IN_PROGRESS" && (
                      <div className="flex flex-col items-end">
                        <span className="font-code-block text-[10px] text-primary mb-1 uppercase">
                          Módulo Actual
                        </span>
                        <div className="w-12 h-1 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <h3 className="font-headline-lg-mobile text-on-surface mb-2">
                    {course.title}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant mb-8 flex-grow">
                    {course.description}
                  </p>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-label-caps text-on-surface-variant">
                        PROGRESO
                      </span>
                      <span
                        className={`font-code-block ${course.status === "COMPLETED" ? "text-tertiary" : course.status === "IN_PROGRESS" ? "text-primary" : "text-outline"}`}
                      >
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full ${course.status === "COMPLETED" ? "bg-tertiary" : course.status === "IN_PROGRESS" ? "bg-primary progress-glow" : "bg-outline"}`}
                        style={{ width: `${course.progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <span
                        className={`material-symbols-outlined ${course.status === "LOCKED" ? "text-outline" : "text-secondary"}`}
                      >
                        bolt
                      </span>
                      <span
                        className={`font-code-block ${course.status === "LOCKED" ? "text-outline" : "text-on-surface"}`}
                      >
                        {course.status === "LOCKED"
                          ? `${course.xpPotential} XP Bloqueados`
                          : `${course.status === "COMPLETED" ? course.xpEarned : course.xpPotential} XP ${course.status === "COMPLETED" ? "Ganados" : "Potenciales"}`}
                      </span>
                    </div>

                    <button
                      className={`w-full mt-6 py-2 px-6 font-bold rounded-lg transition-all active:scale-95 ${
                        course.status === "COMPLETED"
                          ? "bg-surface-variant text-on-surface border border-outline-variant hover:bg-surface-bright"
                          : course.status === "IN_PROGRESS"
                            ? "bg-primary text-on-primary border-b-4 border-on-primary-fixed-variant hover:opacity-90 active:translate-y-[2px] active:border-b-0"
                            : "bg-surface-container-highest text-outline border border-outline-variant cursor-not-allowed"
                      }`}
                      disabled={course.status === "LOCKED"}
                    >
                      {course.status === "COMPLETED"
                        ? "Repasar"
                        : course.status === "IN_PROGRESS"
                          ? "Continuar"
                          : "Bloqueado"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA Section */}
          <section className="mt-12 p-8 rounded-2xl bg-surface-container-high border border-outline-variant relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <svg
                fill="none"
                height="100%"
                viewBox="0 0 400 400"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 40H400M0 80H400M0 120H400M0 160H400M0 200H400M0 240H400M0 280H400M0 320H400M0 360H400"
                  stroke="#2563eb"
                  stroke-width="0.5"
                ></path>
                <path
                  d="M40 0V400M80 0V400M120 0V400M160 0V400M200 0V400M240 0V400M280 0V400M320 0V400M360 0V400"
                  stroke="#2563eb"
                  stroke-width="0.5"
                ></path>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-headline-lg-mobile text-on-surface mb-2">
                  ¿Listo para un desafío?
                </h4>
                <p className="font-body-sm text-on-surface-variant">
                  El desafío diario está disponible. ¡Gana XP extra y mantén tu
                  racha!
                </p>
              </div>
              <button className="bg-tertiary text-on-tertiary font-bold py-3 px-8 rounded-lg btn-primary hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap">
                <span className="material-symbols-outlined">terminal</span>
                Desafío Diario
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
