const CourseCard = ({ course, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-slate-400 text-3xl">
            sentiment_dissatisfied
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {error}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Pronto tendremos nuevos desafíos para ti.
        </p>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="course-card group">
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
              {course.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              {course.description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-[#6324eb]">
              {course.progressPercent}%
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Completado
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button className="flex-1 bg-[#6324eb] text-white py-3.5 rounded-2xl font-bold hover:bg-[#6324eb]/90 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined filled-icon">
              {course.isCompleted ? "replay" : "play_arrow"}
            </span>
            {course.isCompleted ? "Repasar curso" : "Continuar aprendiendo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
