const ActivityItem = ({ icon, iconBg, iconColor, title, subtitle }) => (
  <div className="activity-item">
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

export default ActivityItem;
