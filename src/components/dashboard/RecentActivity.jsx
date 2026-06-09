import ActivityItem from "./ActivityItem";

const RecentActivity = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Actividad Reciente
        </h2>
        <button className="text-xs font-bold text-[#6324eb] hover:underline">
          Ver Todo
        </button>
      </div>

      <div className="space-y-4">
        <ActivityItem
          icon="check_circle"
          iconBg="bg-green-500/10"
          iconColor="text-green-500"
          title="Completado: While Loops"
          subtitle="Ganaste 15 XP • hace 2h"
        />
        <ActivityItem
          icon="emoji_events"
          iconBg="bg-[#6324eb]/10"
          iconColor="text-[#6324eb]"
          title="¡Nuevo Logro!"
          subtitle="Maestro de Lógica Nivel 1 • hace 5h"
        />
        <ActivityItem
          icon="local_fire_department"
          iconBg="bg-[#F97316]/10"
          iconColor="text-[#F97316]"
          title="Racha Extendida"
          subtitle={`Alcanzaste el hito de ${user?.streak || 0} días • Ayer`}
        />
      </div>

      {/* Promo card */}
      <div className="promo-card">
        <div className="relative z-10">
          <h4 className="font-bold text-lg leading-tight">
            Únete al Torneo de Fin de Semana
          </h4>
          <p className="text-indigo-100 text-xs mt-2">
            Compite con otros 200 por el Top 10.
          </p>
          <button className="mt-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
            Ver Tabla de Clasificación
          </button>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default RecentActivity;
