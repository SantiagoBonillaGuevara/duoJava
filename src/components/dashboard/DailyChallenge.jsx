const DailyChallenge = () => {
  return (
    <div className="daily-challenge-banner">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <span className="material-symbols-outlined text-3xl">bolt</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">Desafío Diario</h3>
          <p className="text-orange-50 font-medium">+50 XP disponible hoy</p>
        </div>
      </div>
      <button className="bg-white text-[#F97316] px-6 py-2 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-sm">
        Empezar Ahora
      </button>
    </div>
  );
};

export default DailyChallenge;
