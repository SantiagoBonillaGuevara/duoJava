const DashboardHeader = ({ user }) => {
  return (
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
  );
};

export default DashboardHeader;
